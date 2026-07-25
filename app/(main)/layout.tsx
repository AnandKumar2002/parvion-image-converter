import { SidebarProvider } from "@/components/providers/SidebarProvider";
import AppHeader from "@/components/layout/AppLayout/AppHeader";
import AppSidebar from "@/components/layout/AppLayout/AppSidebar";
import AppFooter from "@/components/layout/AppLayout/AppFooter";
import { PromoSection } from "@/components/layout/AppLayout/PromoSections";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      {/* Navigation & Main Content */}
      <AppHeader />
      <AppSidebar />
      <div className="relative z-10 pt-16 flex justify-center mx-auto w-full px-4 xl:px-8 gap-8">
        <PromoSection side="left" />
        <main className="flex-1 min-w-0 w-full flex flex-col pt-8">
          {children}
          <AppFooter />
        </main>
        <PromoSection side="right" />
      </div>
    </SidebarProvider>
  );
}
