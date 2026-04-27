"use client";

import { useEffect, useState } from "react";
import { DataTable } from "../products/DataTable";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.data || []))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{orders.length} orders</p>
      <DataTable data={orders} columns={[
        { key: "email", label: "Customer" },
        { key: "status", label: "Status" },
        { key: "total", label: "Total" },
        { key: "created_at", label: "Date" },
      ]} />
    </div>
  );
}
