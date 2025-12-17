import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { NavigationProvider } from "@/components/dashboard/navigation-provider";
import { Header } from "@/components/layout/Header";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { SideMenu } from "@/components/layout/SideMenu";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function NotesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <Header />
      <SideMenu />
      <ResizablePanelGroup direction="horizontal">
        <NavigationProvider>
          <SidebarProvider>
            <ResizablePanel className="flex rounded-lg mt-[38px] ml-[38px] w-full bg-white">
              <AppSidebar />
              <div className="bg-white">
                  {children}
              </div>
            </ResizablePanel>
          </SidebarProvider>
        </NavigationProvider>
      </ResizablePanelGroup>
    </ProtectedRoute>
  );
}