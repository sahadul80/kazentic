import { AppBreadcrumb } from "@/components/dashboard/app-breadcrumb";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { NavigationProvider } from "@/components/dashboard/navigation-provider";
import { Header } from "@/components/layout/Header";
import { SideMenu } from "@/components/layout/SideMenu";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <Header/>
    <SideMenu/>
    <NavigationProvider>
      <SidebarProvider>
        <AppSidebar/>
        {children}
      </SidebarProvider>
    </NavigationProvider>
    </>
  );
}