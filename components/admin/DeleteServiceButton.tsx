"use client";

import { Trash2 } from "lucide-react";
import { deleteServiceAction } from "@/app/admin/actions";

/**
 * Delete a service from the admin menu. Confirmation happens client-side;
 * the server action re-checks that no bookings reference the service.
 */
export function DeleteServiceButton({ slug, name }: { slug: string; name: string }) {
  return (
    <form
      action={deleteServiceAction}
      onSubmit={(e) => {
        if (
          !window.confirm(
            `Delete "${name}" permanently?\n\nIts booking link stops working immediately. This can't be undone.`
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8C2F2F] hover:underline"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        Delete service
      </button>
    </form>
  );
}
