"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface AnalyticsData {
  stats: {
    total_revenue: number;
    total_orders: number;
    total_products: number;
    pending_orders: number;
    processing_orders: number;
    shipped_orders: number;
    delivered_orders: number;
  };
  salesChart: { date: string; revenue: number; orders: number }[];
  topProducts: { product_id: string; product_name: string; total_sold: number; revenue: number }[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((d) => { if (d.data) setData(d.data); })
      .catch(console.error);
  }, []);

  const stats = data?.stats;
  const maxRevenue = Math.max(...(data?.salesChart?.map((s) => s.revenue) || [1]), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Delivered Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading">{stats?.delivered_orders ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading">{stats?.processing_orders ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Shipped</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading">{stats?.shipped_orders ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading">{stats?.pending_orders ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Sales Overview (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.salesChart && data.salesChart.length > 0 ? (
            <div className="space-y-2">
              {data.salesChart.map((day) => (
                <div key={day.date} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20 shrink-0">{day.date}</span>
                  <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                    <div
                      className="h-full bg-accent/80 rounded transition-all"
                      style={{ width: `${Math.max((day.revenue / maxRevenue) * 100, 1)}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-24 text-right">{formatPrice(day.revenue)}</span>
                  <span className="text-xs text-muted-foreground w-12 text-right">{day.orders} ord.</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No sales data available yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.topProducts && data.topProducts.length > 0 ? (
            <div className="space-y-3">
              {data.topProducts.map((product, i) => (
                <div key={product.product_id ?? i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-6">{i + 1}.</span>
                    <span className="text-sm font-medium">{product.product_name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-sm text-muted-foreground">{product.total_sold} sold</span>
                    <span className="text-sm font-medium">{formatPrice(product.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No product sales data available yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
