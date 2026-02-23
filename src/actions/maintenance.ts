"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getTenantMaintenance() {
  const supabase = await createClient();
  const { verifyTenantJWT } = await import("@/lib/auth/tenant-jwt");
  const { cookies } = await import("next/headers");

  const cookieStore = await cookies();
  const token = cookieStore.get("tenant_session")?.value;

  if (!token) {
     throw new Error("Unauthorized");
  }

  const payload = await verifyTenantJWT(token);
  if (!payload || !payload.tenant_id) {
     throw new Error("Invalid session");
  }

  const { data, error } = await supabase
    .from("maintenance_requests")
    .select("*")
    .eq("tenant_id", payload.tenant_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tenant maintenance:", error);
    return [];
  }

  return data;
}

export async function getAllMaintenance() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("maintenance_requests")
    .select(`
      *,
      tenant:tenants (
        id,
        email,
        phone,
        apartment:apartments (
          unit_name,
          unit_number
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all maintenance:", error);
    return [];
  }

  return data;
}

export async function createMaintenanceRequest(values: { title: string; description: string; priority: string }) {
  console.log("createMaintenanceRequest called with values:", values);
  const supabase = await createClient();
  const { verifyTenantJWT } = await import("@/lib/auth/tenant-jwt");
  const { cookies } = await import("next/headers");

  const cookieStore = await cookies();
  const token = cookieStore.get("tenant_session")?.value;

  console.log("Token present:", !!token);

  if (!token) {
     throw new Error("Unauthorized");
  }

  const payload = await verifyTenantJWT(token);
  console.log("JWT Payload:", payload);
  if (!payload || !payload.tenant_id) {
     throw new Error("Invalid session");
  }

  const { data: tenantData } = await supabase
    .from("tenants")
    .select("apartment_id")
    .eq("id", payload.tenant_id)
    .single();

  if (!tenantData?.apartment_id) {
    throw new Error("No apartment associated with this tenant.");
  }

  console.log("Attempting insert for tenant:", payload.tenant_id);
  const { data, error } = await supabase
    .from("maintenance_requests")
    .insert([{
      tenant_id: payload.tenant_id,
      apartment_id: tenantData.apartment_id,
      title: values.title,
      description: values.description,
      priority: values.priority,
      status: "SUBMITTED",
    }])
    .select()
    .single();

  console.log("Insert result:", { data, error });

  if (error) {
    throw new Error(`Failed to create request: ${error.message}`);
  }

  revalidatePath("/tenant/maintenance");
  return data;
}

export async function updateMaintenanceStatus(id: string, status: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("maintenance_requests")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update status: ${error.message}`);
  }

  // Send Notification
  if (data.tenant_id) {
    const { data: tenant } = await supabase
      .from("tenants")
      .select("email, phone, apartment:apartments(unit_name)")
      .eq("id", data.tenant_id)
      .single();

    if (tenant) {
      try {
        const { sendNotification } = await import('@/lib/notifications/dispatcher');
        const { MaintenanceUpdateEmail } = await import('@/emails/MaintenanceUpdateEmail');
        
        const unitName = tenant.apartment?.[0]?.unit_name || "your apartment";
        
        await sendNotification({
          to: { email: tenant.email, phone: tenant.phone },
          subject: `Maintenance Update: ${data.title} - PILAS Properties`,
          emailComponent: MaintenanceUpdateEmail({
            tenantName: tenant.email.split('@')[0],
            unitName: unitName,
            ticketTitle: data.title,
            status: status.replace("_", " "),
            portalUrl: "https://pilasproperties.com/tenant-login"
          }),
          smsMessage: `PILAS Properties: Your maintenance request "${data.title}" status has been updated to ${status.replace("_", " ")}. Check portal for details.`
        });
      } catch (notifError) {
        console.error("Failed to send maintenance notification:", notifError);
      }
    }
  }

  revalidatePath("/admin/maintenance");
  return data;
}
