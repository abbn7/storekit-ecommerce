import { Navbar } from "@/components/store/Navbar";
import { Footer } from "@/components/store/Footer";
import { AnnouncementBar } from "@/components/store/AnnouncementBar";
import { CartDrawer } from "@/components/store/CartDrawer";
import { MobileMenu } from "@/components/store/MobileMenu";
import { SearchOverlay } from "@/components/store/SearchOverlay";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <MobileMenu />
      <CartDrawer />
      <SearchOverlay />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
