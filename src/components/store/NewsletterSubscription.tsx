"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/lib/motion";
import { motion, AnimatePresence } from "framer-motion";

interface NewsletterSubscriptionProps {
  className?: string;
  variant?: "footer" | "section";
}

export function NewsletterSubscription({ className, variant = "footer" }: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  };

  if (variant === "section") {
    return (
      <section className={className}>
        <FadeIn>
          <div className="glass-panel rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <Mail className="h-8 w-8 text-accent mx-auto mb-4" />
            <h3 className="font-heading text-2xl sm:text-3xl font-light tracking-wide mb-3">
              Stay in the Loop
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Subscribe for exclusive access to new collections, special offers, and style inspiration.
            </p>
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 text-sm text-green-600"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Welcome aboard! Check your inbox for a confirmation.</span>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="flex gap-2 max-w-md mx-auto"
                >
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-background/50"
                    disabled={status === "loading"}
                  />
                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="accent-gradient text-white hover:opacity-90 transition-opacity px-6"
                  >
                    {status === "loading" ? (
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
            {status === "error" && (
              <p className="text-xs text-destructive mt-2">{errorMessage}</p>
            )}
            <p className="text-[10px] text-muted-foreground mt-4">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </FadeIn>
      </section>
    );
  }

  // Footer variant (compact)
  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs text-green-400"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Subscribed! Check your inbox.</span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="flex gap-2"
          >
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 h-9 bg-background/10 border-background/20 text-background placeholder:text-background/30 text-xs"
              disabled={status === "loading"}
            />
            <Button
              type="submit"
              size="sm"
              disabled={status === "loading"}
              className="accent-gradient text-white hover:opacity-90 transition-opacity text-xs h-9 px-4"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
      {status === "error" && (
        <p className="text-[10px] text-red-400 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
