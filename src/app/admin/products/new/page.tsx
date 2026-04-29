"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

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
        : undefined,
      sku: formData.get("sku") || undefined,
      isActive: true,
      isFeatured: false,
      isNew: true,
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to create product");
      }

      const result = await res.json();
      const productId = result.data?.id;

      // Upload image if selected
      if (productId && imageFile) {
        setImageUploading(true);
        const uploadForm = new FormData();
        uploadForm.append("file", imageFile);
        uploadForm.append("folder", "products");

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadForm,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          if (uploadData.data?.url) {
            await fetch(`/api/admin/products/${productId}/images`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                url: uploadData.data.url,
                width: uploadData.data.width,
                height: uploadData.data.height,
                isPrimary: true,
              }),
            });
          }
        }
        setImageUploading(false);
      }

      router.push("/admin/products");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="font-heading text-2xl tracking-wide mb-8">New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={4} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input id="price" name="price" type="number" step="0.01" required />
          </div>
          <div>
            <Label htmlFor="compareAtPrice">Compare at Price ($)</Label>
            <Input id="compareAtPrice" name="compareAtPrice" type="number" step="0.01" />
          </div>
        </div>
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" name="sku" />
        </div>
        <div>
          <Label htmlFor="image">Product Image</Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
          {imageFile && (
            <p className="text-sm text-muted-foreground mt-1">{imageFile.name}</p>
          )}
        </div>
        <div className="flex gap-4">
          <Button type="submit" disabled={loading || imageUploading}>
            {loading ? "Creating..." : imageUploading ? "Uploading image..." : "Create Product"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
