import type { Metadata } from "next";
import { FadeIn, StaggerContainer, StaggerItem } from "@/lib/motion";
import { Ruler } from "lucide-react";

export const metadata: Metadata = {
  title: "Size Guide",
  description: "Find your perfect fit with our comprehensive size guide. Measurements, tips, and conversion charts.",
};

const SIZE_CHARTS = [
  {
    title: "Clothing",
    headers: ["Size", "Bust (in)", "Waist (in)", "Hips (in)", "EU Equivalent"],
    rows: [
      ["XS", "31–32", "23–24", "33–34", "32–34"],
      ["S", "33–34", "25–26", "35–36", "36–38"],
      ["M", "35–36", "27–28", "37–38", "40–42"],
      ["L", "37–39", "29–31", "39–41", "44–46"],
      ["XL", "40–42", "32–34", "42–44", "48–50"],
    ],
  },
  {
    title: "Shoes",
    headers: ["US", "EU", "UK", "Foot Length (in)"],
    rows: [
      ["6", "39", "5.5", "9.25"],
      ["7", "40", "6.5", "9.625"],
      ["8", "41", "7.5", "10"],
      ["9", "42", "8.5", "10.375"],
      ["10", "43", "9.5", "10.75"],
      ["11", "44", "10.5", "11.125"],
      ["12", "45", "11.5", "11.5"],
    ],
  },
];

const TIPS = [
  {
    title: "Measure Yourself",
    description: "Use a flexible tape measure. For the most accurate results, measure over lightweight clothing or undergarments.",
  },
  {
    title: "Bust",
    description: "Measure around the fullest part of your chest, keeping the tape level and snug but not tight.",
  },
  {
    title: "Waist",
    description: "Measure around your natural waistline — the narrowest part of your torso, typically above your belly button.",
  },
  {
    title: "Hips",
    description: "Stand with feet together and measure around the fullest part of your hips and buttocks.",
  },
  {
    title: "Between Sizes?",
    description: "We recommend sizing up for a more relaxed fit or sizing down for a slimmer silhouette. Check individual product descriptions for fit notes.",
  },
];

export default function SizeGuidePage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 block">
              Fit & Sizing
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-light tracking-wide mb-4">
              Size Guide
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Find your perfect fit. Use our charts and measuring tips to ensure the best possible experience.
            </p>
          </div>
        </FadeIn>

        {/* Size Charts */}
        {SIZE_CHARTS.map((chart) => (
          <FadeIn key={chart.title} delay={0.1}>
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-muted">
                  <Ruler className="h-5 w-5 text-accent" />
                </div>
                <h2 className="font-heading text-2xl tracking-wide">{chart.title}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {chart.headers.map((header) => (
                        <th key={header} className="py-3 px-4 text-left font-medium text-xs tracking-wider uppercase">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chart.rows.map((row, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        {row.map((cell, j) => (
                          <td key={j} className={`py-3 px-4 ${j === 0 ? "font-medium" : "text-muted-foreground"}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </FadeIn>
        ))}

        {/* Measuring Tips */}
        <FadeIn delay={0.2}>
          <section>
            <h2 className="font-heading text-2xl tracking-wide mb-6">How to Measure</h2>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TIPS.map((tip) => (
                <StaggerItem key={tip.title}>
                  <div className="glass-panel rounded-xl p-5 h-full">
                    <h3 className="font-medium text-sm mb-2">{tip.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
