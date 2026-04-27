"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "../products/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminContentPage() {
  const [banners, setBanners] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/banners").then((r) => r.json()),
      fetch("/api/admin/announcements").then((r) => r.json()),
      fetch("/api/admin/testimonials").then((r) => r.json()),
    ])
      .then(([b, a, t]) => {
        setBanners(b.data || []);
        setAnnouncements(a.data || []);
        setTestimonials(t.data || []);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="banners">
        <TabsList>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{banners.length} banners</p>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Banner</Button>
          </div>
          <DataTable data={banners} columns={[
            { key: "title", label: "Title" },
            { key: "position", label: "Position" },
            { key: "is_active", label: "Active" },
          ]} />
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{announcements.length} announcements</p>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Announcement</Button>
          </div>
          <DataTable data={announcements} columns={[
            { key: "text", label: "Text" },
            { key: "is_active", label: "Active" },
          ]} />
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{testimonials.length} testimonials</p>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Testimonial</Button>
          </div>
          <DataTable data={testimonials} columns={[
            { key: "author_name", label: "Author" },
            { key: "rating", label: "Rating" },
            { key: "is_active", label: "Active" },
          ]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
