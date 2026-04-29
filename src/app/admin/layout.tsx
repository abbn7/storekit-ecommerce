import { AdminSidebar } from "@/components/admin/AdminSidebar";

// L5 FIX: Layout is now a server component; sidebar logic extracted to client component
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Don't show sidebar on login page
  // We handle this inside AdminSidebar by checking pathname
  return (
    <div className="flex h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
