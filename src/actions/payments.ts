"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getPayments() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .select(`
      *,
      tenant:tenants (
        id,
        email,
        apartment:apartments (
          unit_name,
          unit_number
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching payments:", error);
    return [];
  }

  return data;
}

export async function getTenantPayments() {
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
    .from("payments")
    .select("*")
    .eq("tenant_id", payload.tenant_id)
    .order("due_date", { ascending: false });

  if (error) {
    console.error("Error fetching tenant payments:", error);
    return [];
  }

  return data;
}

export async function createManualPayment(values: {
  tenant_id: string;
  apartment_id: string;
  type: 'RENT' | 'UTILITY' | 'DEPOSIT';
  amount: number;
  due_date: string;
  notes?: string;
  status: 'PENDING' | 'PAID';
}) {
  const supabase = await createClient();
  
  const payload = {
    ...values,
    amount_paid: values.status === 'PAID' ? values.amount : 0,
    paid_at: values.status === 'PAID' ? new Date().toISOString() : null,
    method: values.status === 'PAID' ? 'CASH' : null,
  };

  const { data, error } = await supabase
    .from("payments")
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create payment: ${error.message}`);
  }

  revalidatePath("/admin/payments");
  return data;
}

export async function updatePaymentStatus(id: string, status: 'PAID', method: string) {
  const supabase = await createClient();

  // First fetch the payment to get its amount
  const { data: currentPayment, error: fetchError } = await supabase
    .from("payments")
    .select("amount")
    .eq("id", id)
    .single();

  if (fetchError || !currentPayment) {
    throw new Error(`Failed to fetch payment details: ${fetchError?.message}`);
  }

  const { data, error } = await supabase
    .from("payments")
    .update({ 
      status, 
      method,
      amount_paid: currentPayment.amount,
      paid_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update payment: ${error.message}`);
  }

  revalidatePath("/admin/payments");
  return data;
}

export async function generateMonthlyInvoices() {
  const supabase = await createClient();
  
  // 1. Get all active tenants
  const { data: tenants, error: tenantsError } = await supabase
    .from("tenants")
    .select(`
      id,
      apartment_id,
      apartment:apartments (
        id,
        monthly_rent,
        water_enabled,
        water_monthly_rate,
        sewage_enabled,
        sewage_monthly_rate,
        cleaning_enabled,
        cleaning_monthly_rate
      )
    `)
    .eq("is_active", true);

  if (tenantsError) {
    throw new Error(`Failed to fetch tenants: ${tenantsError.message}`);
  }

  if (!tenants || tenants.length === 0) {
    return { message: "No active tenants found", count: 0 };
  }

  const newPayments: any[] = [];
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(1); // Due on 1st of next month by default
  const dueDateStr = nextMonth.toISOString().split('T')[0];
  const monthName = nextMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  // 2. Build invoice records
  for (const tenant of tenants) {
    if (!tenant.apartment) continue;
    const apt = tenant.apartment as any;

    // Rent Invoice
    newPayments.push({
      tenant_id: tenant.id,
      apartment_id: tenant.apartment_id,
      type: 'RENT',
      amount: apt.monthly_rent,
      due_date: dueDateStr,
      notes: `Rent for ${monthName}`,
      status: 'PENDING',
      amount_paid: 0,
    });

    // Utilities Invoice
    let totalUtility = 0;
    const activeUtilities = [];

    if (apt.water_enabled) {
      totalUtility += apt.water_monthly_rate || 0;
      activeUtilities.push('Water');
    }
    if (apt.sewage_enabled) {
      totalUtility += apt.sewage_monthly_rate || 0;
      activeUtilities.push('Sewage');
    }
    if (apt.cleaning_enabled) {
      totalUtility += apt.cleaning_monthly_rate || 0;
      activeUtilities.push('Cleaning');
    }

    if (totalUtility > 0) {
      newPayments.push({
        tenant_id: tenant.id,
        apartment_id: tenant.apartment_id,
        type: 'UTILITY',
        amount: totalUtility,
        due_date: dueDateStr,
        notes: `Utilities (${activeUtilities.join(', ')}) for ${monthName}`,
        status: 'PENDING',
        amount_paid: 0,
      });
    }
  }

  // 3. Batch insert
  const { error: insertError } = await supabase
    .from("payments")
    .insert(newPayments);

  if (insertError) {
    throw new Error(`Failed to generate invoices: ${insertError.message}`);
  }

  revalidatePath("/admin/payments");
  return { message: "Successfully generated invoices", count: newPayments.length };
}
