import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with our team. We're here to help with any questions about orders, products, or services.",
};

export default function ContactPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 block">
              Get in Touch
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light tracking-wide mb-4">
              Contact Us
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              We'd love to hear from you. Our team is here to help with any questions about our products or services.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <FadeIn delay={0.1}>
            <div className="space-y-8">
              <StaggerContainer className="space-y-6">
                <StaggerItem>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-muted">
                      <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Email</h3>
                      <p className="text-sm text-muted-foreground">hello@maison.com</p>
                      <p className="text-xs text-muted-foreground mt-1">We reply within 24 hours</p>
                    </div>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-muted">
                      <Phone className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Phone</h3>
                      <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                      <p className="text-xs text-muted-foreground mt-1">Mon–Fri, 9am–6pm EST</p>
                    </div>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-muted">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Visit Us</h3>
                      <p className="text-sm text-muted-foreground">123 Fashion Avenue<br />New York, NY 10001</p>
                    </div>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-muted">
                      <Clock className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Business Hours</h3>
                      <p className="text-sm text-muted-foreground">
                        Monday – Friday: 9am – 6pm<br />
                        Saturday: 10am – 4pm<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </FadeIn>

          {/* Contact Form */}
          <FadeIn delay={0.2}>
            <form className="glass-panel rounded-2xl p-8 space-y-5">
              <h2 className="font-heading text-2xl tracking-wide mb-2">Send a Message</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="text-sm font-medium mb-1.5 block">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="text-sm font-medium mb-1.5 block">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium mb-1.5 block">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="subject" className="text-sm font-medium mb-1.5 block">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Support</option>
                  <option value="product">Product Question</option>
                  <option value="returns">Returns & Exchanges</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="text-sm font-medium mb-1.5 block">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 accent-gradient text-white hover:opacity-90 transition-opacity text-sm tracking-wider uppercase rounded-md font-medium"
              >
                Send Message
              </button>
            </form>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
