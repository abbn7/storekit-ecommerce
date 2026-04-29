"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DataTable } from "../products/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ─── Types ─────────────────────────────────────────────
interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  position: string;
  isActive: boolean;
  sortOrder: number;
}

interface Announcement {
  id: string;
  text: string;
  linkUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

interface Testimonial {
  id: string;
  authorName: string;
  authorTitle: string | null;
  content: string;
  avatarUrl: string | null;
  rating: number;
  isActive: boolean;
  sortOrder: number;
}

// ─── Component ─────────────────────────────────────────
export default function AdminContentPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Dialog states
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);

  // Form states
  const [bannerForm, setBannerForm] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "",
    position: "hero" as "hero" | "middle" | "bottom",
    isActive: true,
    sortOrder: 0,
  });
  const [announcementForm, setAnnouncementForm] = useState({
    text: "",
    linkUrl: "",
    isActive: true,
    sortOrder: 0,
  });
  const [testimonialForm, setTestimonialForm] = useState({
    authorName: "",
    authorTitle: "",
    content: "",
    avatarUrl: "",
    rating: 5,
    isActive: true,
    sortOrder: 0,
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchData = () => {
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ─── Banner submit ───────────────────────────────────
  const handleBannerSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bannerForm),
      });
      if (res.ok) {
        setBannerDialogOpen(false);
        setBannerForm({
          title: "",
          subtitle: "",
          imageUrl: "",
          linkUrl: "",
          position: "hero",
          isActive: true,
          sortOrder: 0,
        });
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create banner");
      }
    } catch {
      alert("Failed to create banner");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Announcement submit ─────────────────────────────
  const handleAnnouncementSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcementForm),
      });
      if (res.ok) {
        setAnnouncementDialogOpen(false);
        setAnnouncementForm({
          text: "",
          linkUrl: "",
          isActive: true,
          sortOrder: 0,
        });
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create announcement");
      }
    } catch {
      alert("Failed to create announcement");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Testimonial submit ──────────────────────────────
  const handleTestimonialSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testimonialForm),
      });
      if (res.ok) {
        setTestimonialDialogOpen(false);
        setTestimonialForm({
          authorName: "",
          authorTitle: "",
          content: "",
          avatarUrl: "",
          rating: 5,
          isActive: true,
          sortOrder: 0,
        });
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create testimonial");
      }
    } catch {
      alert("Failed to create testimonial");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="banners">
        <TabsList>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>

        {/* ─── Banners Tab ──────────────────────────────── */}
        <TabsContent value="banners" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{banners.length} banners</p>
            <Button size="sm" onClick={() => setBannerDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add Banner
            </Button>
          </div>
          <DataTable data={banners} columns={[
            { key: "title", label: "Title" },
            { key: "position", label: "Position" },
            { key: "isActive", label: "Active" },
          ]} />
        </TabsContent>

        {/* ─── Announcements Tab ────────────────────────── */}
        <TabsContent value="announcements" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{announcements.length} announcements</p>
            <Button size="sm" onClick={() => setAnnouncementDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add Announcement
            </Button>
          </div>
          <DataTable data={announcements} columns={[
            { key: "text", label: "Text" },
            { key: "isActive", label: "Active" },
          ]} />
        </TabsContent>

        {/* ─── Testimonials Tab ─────────────────────────── */}
        <TabsContent value="testimonials" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{testimonials.length} testimonials</p>
            <Button size="sm" onClick={() => setTestimonialDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add Testimonial
            </Button>
          </div>
          <DataTable data={testimonials} columns={[
            { key: "authorName", label: "Author" },
            { key: "rating", label: "Rating" },
            { key: "isActive", label: "Active" },
          ]} />
        </TabsContent>
      </Tabs>

      {/* ─── Add Banner Dialog ──────────────────────────── */}
      <Dialog open={bannerDialogOpen} onOpenChange={setBannerDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Banner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="banner-title">Title *</Label>
              <Input
                id="banner-title"
                value={bannerForm.title}
                onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                placeholder="Banner title"
              />
            </div>
            <div>
              <Label htmlFor="banner-subtitle">Subtitle</Label>
              <Input
                id="banner-subtitle"
                value={bannerForm.subtitle}
                onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                placeholder="Banner subtitle"
              />
            </div>
            <div>
              <Label htmlFor="banner-image">Image URL *</Label>
              <Input
                id="banner-image"
                value={bannerForm.imageUrl}
                onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="banner-link">Link URL</Label>
              <Input
                id="banner-link"
                value={bannerForm.linkUrl}
                onChange={(e) => setBannerForm({ ...bannerForm, linkUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="banner-position">Position</Label>
              <select
                id="banner-position"
                value={bannerForm.position}
                onChange={(e) => setBannerForm({ ...bannerForm, position: e.target.value as "hero" | "middle" | "bottom" })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="hero">Hero</option>
                <option value="middle">Middle</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
            <div>
              <Label htmlFor="banner-sort">Sort Order</Label>
              <Input
                id="banner-sort"
                type="number"
                value={bannerForm.sortOrder}
                onChange={(e) => setBannerForm({ ...bannerForm, sortOrder: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={bannerForm.isActive}
                onCheckedChange={(checked) => setBannerForm({ ...bannerForm, isActive: checked })}
              />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBannerDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleBannerSubmit} disabled={submitting || !bannerForm.title || !bannerForm.imageUrl}>
              {submitting ? "Creating..." : "Create Banner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Add Announcement Dialog ────────────────────── */}
      <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Announcement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="announcement-text">Text *</Label>
              <Textarea
                id="announcement-text"
                value={announcementForm.text}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, text: e.target.value })}
                placeholder="Announcement text"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="announcement-link">Link URL</Label>
              <Input
                id="announcement-link"
                value={announcementForm.linkUrl}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, linkUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="announcement-sort">Sort Order</Label>
              <Input
                id="announcement-sort"
                type="number"
                value={announcementForm.sortOrder}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, sortOrder: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={announcementForm.isActive}
                onCheckedChange={(checked) => setAnnouncementForm({ ...announcementForm, isActive: checked })}
              />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnnouncementDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAnnouncementSubmit} disabled={submitting || !announcementForm.text}>
              {submitting ? "Creating..." : "Create Announcement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Add Testimonial Dialog ─────────────────────── */}
      <Dialog open={testimonialDialogOpen} onOpenChange={setTestimonialDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Testimonial</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="testimonial-author">Author Name *</Label>
              <Input
                id="testimonial-author"
                value={testimonialForm.authorName}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, authorName: e.target.value })}
                placeholder="Author name"
              />
            </div>
            <div>
              <Label htmlFor="testimonial-title">Author Title</Label>
              <Input
                id="testimonial-title"
                value={testimonialForm.authorTitle}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, authorTitle: e.target.value })}
                placeholder="e.g. CEO at Company"
              />
            </div>
            <div>
              <Label htmlFor="testimonial-content">Content *</Label>
              <Textarea
                id="testimonial-content"
                value={testimonialForm.content}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                placeholder="Testimonial content"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="testimonial-avatar">Avatar URL</Label>
              <Input
                id="testimonial-avatar"
                value={testimonialForm.avatarUrl}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, avatarUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="testimonial-rating">Rating (1-5)</Label>
              <Input
                id="testimonial-rating"
                type="number"
                min={1}
                max={5}
                value={testimonialForm.rating}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value) || 5 })}
              />
            </div>
            <div>
              <Label htmlFor="testimonial-sort">Sort Order</Label>
              <Input
                id="testimonial-sort"
                type="number"
                value={testimonialForm.sortOrder}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, sortOrder: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={testimonialForm.isActive}
                onCheckedChange={(checked) => setTestimonialForm({ ...testimonialForm, isActive: checked })}
              />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestimonialDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleTestimonialSubmit} disabled={submitting || !testimonialForm.authorName || !testimonialForm.content}>
              {submitting ? "Creating..." : "Create Testimonial"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
