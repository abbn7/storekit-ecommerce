import { logger } from "@/lib/logger";
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
};

export default function EditCollectionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/collections/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCollection(data.data || null);
        setFetching(false);
      })
      .catch((err) => {
        logger.error(err);
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
      description: formData.get("description") || null,
      imageUrl: formData.get("imageUrl") || null,
      isActive: formData.get("isActive") === "on",
    };

    try {
      const res = await fetch(`/api/admin/collections/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) router.push("/admin/collections");
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p className="py-12 text-center">Loading...</p>;
  if (!collection) return <p className="py-12 text-center">Collection not found.</p>;

  return (
    <div className="max-w-2xl">
      <h2 className="font-heading text-2xl tracking-wide mb-8">Edit Collection</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Collection Name</Label>
          <Input id="name" name="name" defaultValue={collection.name} required />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={collection.slug} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={collection.description ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="url"
            defaultValue={collection.imageUrl ?? ""}
          />
        </div>
        <div className="flex items-center justify-between border rounded-lg p-4">
          <Label htmlFor="isActive">Active</Label>
          <Switch id="isActive" name="isActive" defaultChecked={collection.isActive} />
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
