import React from "react";
import { getApartmentById } from "@/actions/apartments";
import { notFound } from "next/navigation";
import { EditApartmentForm } from "./edit-form";

export default async function EditApartmentPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const apartment = await getApartmentById(id);

  if (!apartment) {
    notFound();
  }

  return <EditApartmentForm apartment={apartment} />;
}
