import { Navbar } from "@/components/store/Navbar";
import { Footer } from "@/components/store/Footer";
import { AnnouncementBar } from "@/components/store/AnnouncementBar";
import { CartDrawer } from "@/components/store/CartDrawer";
import { MobileMenu } from "@/components/store/MobileMenu";
import { SearchOverlay } from "@/components/store/SearchOverlay";
import { BackToTop } from "@/components/store/BackToTop";
import { getStoreConfig } from "@/lib/db/queries/store";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getStoreConfig().catch(() => null);

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <MobileMenu />
      <CartDrawer />
      <SearchOverlay />
      <main className="min-h-screen">{children}</main>
      <Footer socialLinks={config?.socialLinks as Record<string, string> | null | undefined} />
      <BackToTop />
    </>
  );
}
