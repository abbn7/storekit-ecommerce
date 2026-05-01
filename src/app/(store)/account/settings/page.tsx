import { logger } from "@/lib/logger";
"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs"; // M9 FIX: Import useUser for Clerk integration
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { FadeIn } from "@/lib/motion";

export default function AccountSettingsPage() {
  const { user, isLoaded } = useUser(); // M9 FIX: Get Clerk user data
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    // M9 FIX: Integrate with Clerk's user.update() API
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const firstName = formData.get("firstName") as string;
      const lastName = formData.get("lastName") as string;

      if (isLoaded && user) {
        await user.update({
          firstName: firstName || undefined,
          lastName: lastName || undefined,
        });
      }

      setSaved(true);
    } catch (err) {
      logger.error("Failed to update settings:", err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h1 className="font-heading text-4xl font-light tracking-wide mb-12">
            Account Settings
          </h1>
        </FadeIn>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FadeIn delay={0.1}>
            <Card className="glass-panel border-0">
              <CardHeader>
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      defaultValue={user?.firstName ?? ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      defaultValue={user?.lastName ?? ""}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user?.emailAddresses[0]?.emailAddress ?? ""}
                    disabled
                  />
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <FadeIn delay={0.2}>
            <div className="flex items-center gap-4">
              <Button type="submit" disabled={loading || !isLoaded} className="accent-gradient text-white hover:opacity-90 transition-opacity">
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              {saved && <span className="text-sm text-green-600">Settings saved!</span>}
            </div>
          </FadeIn>
        </form>
      </div>
    </div>
  );
}
