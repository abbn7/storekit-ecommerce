"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  const [config, setConfig] = useState({
    name: "",
    description: "",
    primaryColor: "#000000",
    accentColor: "#C8A96E",
    currency: "USD",
    freeShippingThreshold: "200",
    shippingCost: "15",
    taxRate: "0.0875",
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/store-config")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          const d = data.data;
          setConfig({
            name: d.name || "",
            description: d.description || "",
            primaryColor: d.primaryColor || "#000000",
            accentColor: d.accentColor || "#C8A96E",
            currency: d.currency || "USD",
            freeShippingThreshold: String(d.freeShippingThreshold ? d.freeShippingThreshold / 100 : 200),
            shippingCost: String(d.shippingCost ? d.shippingCost / 100 : 15),
            taxRate: String(d.taxRate || "0.0875"),
          });
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      await fetch("/api/admin/store-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: config.name,
          description: config.description,
          primaryColor: config.primaryColor,
          accentColor: config.accentColor,
          currency: config.currency,
          freeShippingThreshold: Math.round(parseFloat(config.freeShippingThreshold) * 100),
          shippingCost: Math.round(parseFloat(config.shippingCost) * 100),
          taxRate: config.taxRate,
        }),
      });
      setSaved(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Store Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Store Name</Label>
              <Input id="name" value={config.name} onChange={(e) => setConfig({ ...config, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={config.description} onChange={(e) => setConfig({ ...config, description: e.target.value })} rows={3} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Theme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <input type="color" value={config.primaryColor} onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })} className="h-10 w-10 rounded border cursor-pointer" />
                  <Input value={config.primaryColor} onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })} />
                </div>
              </div>
              <div>
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex gap-2">
                  <input type="color" value={config.accentColor} onChange={(e) => setConfig({ ...config, accentColor: e.target.value })} className="h-10 w-10 rounded border cursor-pointer" />
                  <Input value={config.accentColor} onChange={(e) => setConfig({ ...config, accentColor: e.target.value })} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Shipping & Tax</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" value={config.currency} onChange={(e) => setConfig({ ...config, currency: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="taxRate">Tax Rate</Label>
                <Input id="taxRate" type="number" step="0.0001" value={config.taxRate} onChange={(e) => setConfig({ ...config, taxRate: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</Label>
                <Input id="freeShippingThreshold" type="number" step="1" value={config.freeShippingThreshold} onChange={(e) => setConfig({ ...config, freeShippingThreshold: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="shippingCost">Shipping Cost ($)</Label>
                <Input id="shippingCost" type="number" step="1" value={config.shippingCost} onChange={(e) => setConfig({ ...config, shippingCost: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Settings"}
          </Button>
          {saved && <span className="text-sm text-green-600">Settings saved!</span>}
        </div>
      </form>
    </div>
  );
}
