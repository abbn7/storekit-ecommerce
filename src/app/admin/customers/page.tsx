import { logger } from "@/lib/logger";
"use client";

import { useEffect, useState } from "react";
import { DataTable } from "../products/DataTable";

type Customer = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  createdAt: string;
  orderCount: number;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        logger.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="py-12 text-center">Loading customers...</div>;
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{customers.length} customers</p>
      <DataTable
        data={customers}
        columns={[
          { key: "email", label: "Email" },
          {
            key: "name",
            label: "Name",
            render: (row) =>
              `${row.firstName || ""} ${row.lastName || ""}`.trim() || "-",
          },
          { key: "orderCount", label: "Orders" },
          {
            key: "createdAt",
            label: "Joined",
            render: (row) =>
              row.createdAt
                ? new Date(row.createdAt as string).toLocaleDateString()
                : "-",
          },
        ]}
      />
    </div>
  );
}
