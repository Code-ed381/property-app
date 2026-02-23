import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";
import { verifyTenantJWT, signTenantJWT } from "@/lib/auth/tenant-jwt";

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();

    if (!passcode || passcode.length < 6) {
      return NextResponse.json(
        { error: "A valid passcode is required (min 6 chars)." },
        { status: 400 }
      );
    }

    // 1. Verify the current session
    const cookieHeader = req.cookies.get("tenant_session");
    if (!cookieHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyTenantJWT(cookieHeader.value);
    if (!payload || !payload.tenant_id) {
       return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const supabase = await createClient();

    // 2. Hash new passcode
    const salt = await bcrypt.genSalt(10);
    const hashedPasscode = await bcrypt.hash(passcode, salt);

    // 3. Update tenant record
    const { error: updateError } = await supabase
      .from("tenants")
      .update({
        password_hash: hashedPasscode,
        must_change_pass: false,
      })
      .eq("id", payload.tenant_id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update passcode in database." },
        { status: 500 }
      );
    }

    // 4. Generate new JWT with must_change_pass = false
    const newToken = await signTenantJWT({
      ...payload,
      must_change_pass: false,
    });

    // 5. Build response and overwrite cookie
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    response.cookies.set("tenant_session", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
      sameSite: "lax",
    });

    return response;

  } catch (err: any) {
    console.error("Change Passcode Error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
