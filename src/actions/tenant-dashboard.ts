"use server";

import { createClient } from "@/lib/supabase/server";

import { cookies } from "next/headers";
import { verifyTenantJWT } from "@/lib/auth/tenant-jwt";

export async function getTenantDashboard() {
  const supabase = await createClient();

  const cookieStore = await cookies();
  const token = cookieStore.get("tenant_session")?.value;

  if (!token) {
     throw new Error("Unauthorized");
  }

  const payload = await verifyTenantJWT(token);
  if (!payload || !payload.tenant_id) {
     throw new Error("Invalid session");
  }

  const tenantId = payload.tenant_id;

  // 1. Fetch Tenant Profile & Apartment
  const { data: profile } = await supabase
    .from("tenants")
    .select(`
      *,
      apartment:apartments (*)
    `)
    .eq("id", tenantId)
    .maybeSingle();

  // 2. Fetch Active Agreement
  const { data: agreement } = await supabase
    .from("agreements")
    .select("*")
    .eq("tenant_id", tenantId)
    .in("status", ["ACTIVE", "SIGNED", "PENDING_SIGNATURE", "DRAFT"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // 3. Fetch Next Pending Payment
  const { data: nextPayment } = await supabase
    .from("payments")
    .select("*")
    .eq("tenant_id", tenantId)
    .in("status", ["PENDING", "OVERDUE"])
    .order("due_date", { ascending: true })
    .limit(1)
    .maybeSingle();

  // 4. Fetch Recent Payments
  const { data: paymentHistory } = await supabase
    .from("payments")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(3);

  // 5. Fetch Recent Maintenance Requests
  const { data: maintenance } = await supabase
    .from("maintenance_requests")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(2);

  return {
    profile,
    agreement,
    nextPayment,
    paymentHistory: paymentHistory || [],
    maintenance: maintenance || []
  };
}
