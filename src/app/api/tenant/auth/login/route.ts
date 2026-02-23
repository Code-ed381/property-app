import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";
import { signTenantJWT } from "@/lib/auth/tenant-jwt";

export async function POST(req: NextRequest) {
  try {
    const { room_number, passcode } = await req.json();

    if (!room_number || !passcode) {
      return NextResponse.json(
        { error: "Room number and passcode are required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. Find apartment by room_number
    const { data: apartment, error: aptError } = await supabase
      .from("apartments")
      .select("id, status")
      .eq("room_number", room_number)
      .single();

    if (aptError || !apartment) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // 2. Find the active tenant linked to this apartment
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("id, password_hash, must_change_pass, is_active")
      .eq("apartment_id", apartment.id)
      .eq("is_active", true)
      .single();

    if (tenantError || !tenant) {
      return NextResponse.json(
        { error: "No active tenant associated with this room." },
        { status: 401 }
      );
    }

    // 3. Verify passcode
    const isMatch = await bcrypt.compare(passcode, tenant.password_hash);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // 4. Generate JWT
    const token = await signTenantJWT({
      tenant_id: tenant.id,
      apartment_id: apartment.id,
      room_number: room_number,
      must_change_pass: tenant.must_change_pass,
      role: 'tenant',
    });

    // 5. Build response and set cookie
    const response = NextResponse.json(
      { 
        success: true, 
        must_change_pass: tenant.must_change_pass 
      },
      { status: 200 }
    );

    response.cookies.set("tenant_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
      sameSite: "lax",
    });

    return response;

  } catch (err: any) {
    console.error("Login Error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
