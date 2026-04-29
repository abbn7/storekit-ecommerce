"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { DataTable } from "../products/DataTable";

type OrderRow = { id: string; total: number; createdAt: string; [key: string]: unknown };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.data || []))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{orders.length} orders</p>
      <DataTable
        data={orders}
        columns={[
          { key: "email", label: "Customer" },
          { key: "status", label: "Status" },
          {
            key: "total",
            label: "Total",
            render: (row) => formatPrice(row.total as number),
          },
          {
            key: "createdAt",
            label: "Date",
            render: (row) =>
              row.createdAt
                ? new Date(row.createdAt as string).toLocaleDateString()
                : "-",
          },
        ]}
        getRowHref={(row) => `/admin/orders/${row.id}`}
      />
    </div>
  );
}
