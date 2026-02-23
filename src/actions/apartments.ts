"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getApartments() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("apartments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching apartments:", error);
    // Return empty array for now to prevent crash if tables don't exist yet
    return [];
  }

  return data;
}

export async function getVacantApartments() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("apartments")
    .select("id, unit_name, unit_number, type, monthly_rent, room_number")
    .eq("status", "VACANT")
    .order("unit_name", { ascending: true });

  if (error) {
    console.error("Error fetching vacant apartments:", error);
    return [];
  }

  return data;
}

export async function createApartment(formData: any) {
  const supabase = await createClient();
  
  // Generate room_number (e.g., PIL-301)
  const room_number = `PIL-${formData.floor || 0}${formData.unit_number}`.toUpperCase().replace(/\s+/g, '');
  
  // Generate random 6-digit passcode
  const raw_passcode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Hash passcode with bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashed_passcode = await bcrypt.hash(raw_passcode, salt);

  const newApartmentData = {
    ...formData,
    room_number,
    tenant_passcode: hashed_passcode,
  };

  const { data, error } = await supabase
    .from("apartments")
    .insert([newApartmentData])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/apartments");
  
  // Return the raw passcode so it can be shown to the admin or sent via email later
  return {
    ...data[0],
    _raw_passcode: raw_passcode // Only used temporarily for UI/Notifications
  };
}

export async function getApartmentById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("apartments")
    .select(`
      *,
      tenant:tenants (
        id,
        email,
        phone,
        is_active
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error("Error fetching apartment by ID:", error);
    return null;
  }

  return data;
}

export async function updateApartment(id: string, formData: any) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("apartments")
    .update(formData)
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/apartments/${id}`);
  revalidatePath("/admin/apartments");
  return data;
}

export async function archiveApartment(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("apartments")
    .update({ status: 'ARCHIVED' })
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/apartments/${id}`);
  revalidatePath("/admin/apartments");
  return data;
}export async function deleteApartment(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("apartments")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/apartments");
}
