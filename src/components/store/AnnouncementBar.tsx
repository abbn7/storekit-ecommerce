"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUpVariants } from "@/lib/motion";

interface Announcement {
  id: string;
  text: string;
  link_url: string | null;
}

export function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => {
        const active = (data.data ?? []).map((a: { id: string; text: string; linkUrl: string | null }) => ({
          id: a.id,
          text: a.text,
          link_url: a.linkUrl,
        }));
        if (active.length > 0) {
          setAnnouncements(active);
        } else {
          setAnnouncements([
            { id: "1", text: "Complimentary shipping on orders over $200", link_url: null },
          ]);
        }
      })
      .catch(() => {
        setAnnouncements([
          { id: "1", text: "Complimentary shipping on orders over $200", link_url: null },
        ]);
      });
  }, []);

  return (
    <AnimatePresence>
      {!isDismissed && announcements.length > 0 && (
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-foreground text-background py-2 relative"
        >
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-background/60 hover:text-background transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-3 w-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
