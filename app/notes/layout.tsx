import { AppBreadcrumb } from "@/components/dashboard/app-breadcrumb";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { NavigationProvider } from "@/components/dashboard/navigation-provider";
import { Header } from "@/components/layout/Header";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { SideMenu } from "@/components/layout/SideMenu";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LucideMessageCircleQuestionMark } from "lucide-react";


export default function NotesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <Header />
      <SideMenu />
      <div className="flex h-[calc(100vh-38px)] w-full rounded-lg">
        <NavigationProvider>
          <SidebarProvider>
            <AppSidebar />
            <div className="flex-1">
              <div className="sticky top-[38px] h-[36px] bg-background border-b flex items-center justify-between mx-auto bg-white">
                <AppBreadcrumb />
                <LucideMessageCircleQuestionMark/>
              </div>
              <div className="flex flex-col h-full max-w-7xl bg-white">
                {children}
              </div>
            </div>
          </SidebarProvider>
        </NavigationProvider>
      </div>
    </ProtectedRoute>
  );
}