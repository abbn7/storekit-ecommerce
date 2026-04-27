import { HeroSection } from "@/components/store/HeroSection";
import { FeaturedCollections } from "@/components/store/FeaturedCollections";
import { MarqueeSection } from "@/components/store/MarqueeSection";
import { TestimonialsSection } from "@/components/store/TestimonialsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCollections />
      <MarqueeSection />
      <TestimonialsSection />
    </>
  );
}
