"use client";

import React, { useState } from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Trash, Loader2 } from "lucide-react";
import { deleteApartment } from "@/actions/apartments";
import { toast } from "sonner";

interface DeleteApartmentActionProps {
  id: string;
}

export function DeleteApartmentAction({ id }: DeleteApartmentActionProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      await deleteApartment(id);
      toast.success("Apartment deleted successfully");
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete apartment");
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem 
          className="gap-2 text-red-400 focus:bg-red-400/10 focus:text-red-400 cursor-pointer"
          onSelect={(e) => e.preventDefault()}
        >
          <Trash className="h-4 w-4" /> Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-300">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            This action cannot be undone. This will permanently delete the apartment
            from our servers and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-500 border-0"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Apartment"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
