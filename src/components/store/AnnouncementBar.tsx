"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface Announcement {
  id: string;
  text: string;
  link_url: string | null;
}

export function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/store-config")
      .then((res) => res.json())
      .then(() => {
        // For now, use a static announcement since we don't have a dedicated endpoint
        setAnnouncements([
          { id: "1", text: "Complimentary shipping on orders over $200", link_url: null },
        ]);
      })
      .catch(() => {});
  }, []);

  if (isDismissed || announcements.length === 0) return null;

  return (
    <div className="bg-foreground text-background py-2 relative">
      <div className="marquee-container">
        <div className="marquee-content">
          {announcements.map((a, i) => (
            <span key={a.id} className="inline-flex items-center gap-8 mx-8">
              {a.link_url ? (
                <Link href={a.link_url} className="text-xs tracking-wider uppercase hover:underline">
                  {a.text}
                </Link>
              ) : (
                <span className="text-xs tracking-wider uppercase">{a.text}</span>
              )}
              {i < announcements.length - 1 && <span className="text-background/30">✦</span>}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {announcements.map((a, i) => (
            <span key={`dup-${a.id}`} className="inline-flex items-center gap-8 mx-8">
              {a.link_url ? (
                <Link href={a.link_url} className="text-xs tracking-wider uppercase hover:underline">
                  {a.text}
                </Link>
              ) : (
                <span className="text-xs tracking-wider uppercase">{a.text}</span>
              )}
              {i < announcements.length - 1 && <span className="text-background/30">✦</span>}
            </span>
          ))}
        </div>
      </div>
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-background/60 hover:text-background"
        aria-label="Dismiss"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
