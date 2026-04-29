"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/lib/motion";

interface TestimonialsSectionProps {
  testimonials?: {
    id: string;
    author_name: string;
    author_title: string | null;
    content: string;
    avatar_url: string | null;
    rating: number;
  }[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const defaultTestimonials = [
    {
      id: "1",
      author_name: "Alexandra Chen",
      author_title: "Creative Director",
      content: "The quality is unmatched. Every piece feels like it was made just for me.",
      avatar_url: null,
      rating: 5,
    },
    {
      id: "2",
      author_name: "James Wright",
      author_title: "Architect",
      content: "Minimal, refined, and built to last. Exactly what I look for.",
      avatar_url: null,
      rating: 5,
    },
    {
      id: "3",
      author_name: "Sofia Martinez",
      author_title: "Gallery Owner",
      content: "From packaging to product, the experience is truly luxurious.",
      avatar_url: null,
      rating: 5,
    },
  ];

  const items = testimonials?.length ? testimonials : defaultTestimonials;

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="font-heading text-3xl sm:text-4xl font-light tracking-wide text-center mb-16">
            What Our Clients Say
          </h2>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {items.map((testimonial) => (
            <StaggerItem key={testimonial.id}>
              <div className="glass-panel rounded-2xl p-8 text-center h-full">
                {/* Stars */}
                <div className="flex items-center justify-center gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="font-heading text-xl sm:text-2xl font-light leading-relaxed mb-6">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center gap-3">
                  {testimonial.avatar_url ? (
                    <div className="relative h-10 w-10 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.avatar_url}
                        alt={testimonial.author_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium accent-gradient-text">
                      {testimonial.author_name.charAt(0)}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-sm font-medium">{testimonial.author_name}</p>
                    {testimonial.author_title && (
                      <p className="text-xs text-muted-foreground">{testimonial.author_title}</p>
                    )}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
