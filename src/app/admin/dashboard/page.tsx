"use client";

import { useEffect, useState } from "react";
import { DollarSign, ShoppingBag, Package, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface Stats {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  pending_orders: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.stats) setStats(data.data.stats);
      })
      .catch(console.error);
  }, []);

  const defaultStats: Stats = {
    total_revenue: 0,
    total_orders: 0,
    total_products: 0,
    pending_orders: 0,
  };

  const s = stats || defaultStats;

  const cards = [
    {
      title: "Total Revenue",
      value: formatPrice(s.total_revenue),
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: s.total_orders.toString(),
      icon: ShoppingBag,
    },
    {
      title: "Total Products",
      value: s.total_products.toString(),
      icon: Package,
    },
    {
      title: "Pending Orders",
      value: s.pending_orders.toString(),
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ title, value, icon: Icon }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-heading">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connect your database to see real-time analytics and recent orders here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
