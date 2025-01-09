"use client";

import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  // Customize segment names for display
  const customNames: { [key: string]: string } = {
    dashboard: "Dashboard",
    settings: "Settings",
    profile: "Profile",
    // Add more mappings as needed
  };
  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const name = customNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

    return { href, name };
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((breadcrumb, index) => (
                      <BreadcrumbItem key={breadcrumb.href}>
                        {index < breadcrumbs.length - 1 ? (
                          <>
                            <BreadcrumbLink href={breadcrumb.href}>
                              {breadcrumb.name}
                            </BreadcrumbLink>
                            <BreadcrumbSeparator className="hidden md:block" />
                          </>
                        ) : (
                          <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <div>{children}</div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
