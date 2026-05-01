import { Navbar } from "@/components/store/Navbar";
import { Footer } from "@/components/store/Footer";
import { AnnouncementBar } from "@/components/store/AnnouncementBar";
import { CartDrawer } from "@/components/store/CartDrawer";
import { MobileMenu } from "@/components/store/MobileMenu";
import { SearchOverlay } from "@/components/store/SearchOverlay";
import { BackToTop } from "@/components/store/BackToTop";
import { CookieConsent } from "@/components/store/CookieConsent";
import { MobileBottomNav } from "@/components/store/MobileBottomNav";
import { getStoreConfig } from "@/lib/db/queries/store";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getStoreConfig().catch(() => null);

  return (
    <>
      {/* Skip to content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-md focus:text-sm"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <Navbar storeName={config?.name} logoUrl={config?.logoUrl} />
      <MobileMenu />
      <CartDrawer />
      <SearchOverlay />
      <main id="main-content" className="min-h-screen">{children}</main>
      <Footer socialLinks={config?.socialLinks as Record<string, string> | null | undefined} storeName={config?.name} logoUrl={config?.logoUrl} />
      <BackToTop />
      <CookieConsent />
      <MobileBottomNav />
    </>
  );
}
