"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "../products/DataTable";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetch("/api/admin/collections")
      .then((res) => res.json())
      .then((data) => setCollections(data.data || []))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{collections.length} collections</p>
        <Button asChild>
          <Link href="/admin/collections/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Collection
          </Link>
        </Button>
      </div>
      <DataTable data={collections} columns={[
        { key: "name", label: "Name" },
        { key: "slug", label: "Slug" },
        { key: "is_active", label: "Active" },
      ]} />
    </div>
  );
}
