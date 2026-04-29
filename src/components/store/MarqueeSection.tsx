import Link from "next/link";
import Image from "next/image";

// I4 FIX: Accept marquee text from props, with configurable default
interface MarqueeSectionProps {
  text?: string;
}

export function MarqueeSection({ text = "Luxury • Crafted • Timeless • Essential" }: MarqueeSectionProps) {
  return (
    <section className="py-8 overflow-hidden border-y">
      <div className="marquee-container">
        <div className="marquee-content flex items-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-[0.15em] uppercase text-muted-foreground/30 whitespace-nowrap mx-8"
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
