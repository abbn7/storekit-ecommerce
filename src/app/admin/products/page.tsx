import { logger } from "@/lib/logger";
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { DataTable } from "./DataTable";
import type { ProductMinimal } from "@/types"; // L3 FIX: Proper typing

export default function AdminProductsPage() {
  // L3 FIX: Properly type the products state
  const [products, setProducts] = useState<ProductMinimal[]>([]);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.data || []))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{products.length} products</p>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>
      <DataTable
        data={products}
        columns={[
          { key: "name", label: "Name" },
          {
            key: "price",
            label: "Price",
            render: (row) => formatPrice(row.price as number),
          },
          { key: "isActive", label: "Active" },
        ]}
        getRowHref={(row) => `/admin/products/${row.id}/edit`}
      />
    </div>
  );
}
