"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  sku: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.data || null);
        setFetching(false);
      })
      .catch((err) => {
        console.error(err);
        setFetching(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      price: Math.round(parseFloat(formData.get("price") as string) * 100),
      compareAtPrice: formData.get("compareAtPrice")
        ? Math.round(parseFloat(formData.get("compareAtPrice") as string) * 100)
        : null,
      sku: formData.get("sku") || null,
      isActive: formData.get("isActive") === "on",
      isFeatured: formData.get("isFeatured") === "on",
      isNew: formData.get("isNew") === "on",
    };

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) router.push("/admin/products");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p className="py-12 text-center">Loading...</p>;
  if (!product) return <p className="py-12 text-center">Product not found.</p>;

  return (
    <div className="max-w-2xl">
      <h2 className="font-heading text-2xl tracking-wide mb-8">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" name="name" defaultValue={product.name} required />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={product.slug} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={4} defaultValue={product.description} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input id="price" name="price" type="number" step="0.01" defaultValue={(product.price / 100).toFixed(2)} required />
          </div>
          <div>
            <Label htmlFor="compareAtPrice">Compare at Price ($)</Label>
            <Input id="compareAtPrice" name="compareAtPrice" type="number" step="0.01" defaultValue={product.compareAtPrice ? (product.compareAtPrice / 100).toFixed(2) : ""} />
          </div>
        </div>
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" name="sku" defaultValue={product.sku ?? ""} />
        </div>
        <div className="space-y-3 border rounded-lg p-4">
          <h3 className="font-medium">Visibility</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Active</Label>
            <Switch id="isActive" name="isActive" defaultChecked={product.isActive} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="isFeatured">Featured</Label>
            <Switch id="isFeatured" name="isFeatured" defaultChecked={product.isFeatured} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="isNew">New Arrival</Label>
            <Switch id="isNew" name="isNew" defaultChecked={product.isNew} />
          </div>
        </div>
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
