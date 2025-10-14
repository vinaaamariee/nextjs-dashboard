"use client";

import { useState } from "react";
import { Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpdateInvoice, DeleteInvoice } from "@/app/ui/invoices/buttons";


export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Button variant="outline" size="sm">
      <Edit3 className="w-4 h-4 mr-1" />
      Edit
    </Button>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      // your delete logic here (API call, etc.)
      alert(`Invoice ${id} deleted!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 className="w-4 h-4 mr-1" />
      {loading ? "Deleting..." : "Delete"}
    </Button>
  );
}
