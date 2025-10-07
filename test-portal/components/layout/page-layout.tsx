"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { BreadcrumbNavigation } from "@/components/layout/breadcrumb-navigation";
import { NavigationControls } from "@/components/layout/navigation-controls";
import { usePathname } from "next/navigation";
import { useApp } from "@/contexts/app-context";

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageLayout({
  children,
  title,
  description,
  actions,
}: PageLayoutProps) {
  const pathname = usePathname();
  const { isSidebarCollapsed } = useApp();

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">
      <Sidebar />

      <div
        className={`flex-1 flex flex-col transition-all duration-200 ${
          isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        <Header />

        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 lg:pt-8 pt-4">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Page Header with Breadcrumb and Navigation Controls */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <BreadcrumbNavigation />
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-100">
                    {title}
                  </h1>
                  {description && (
                    <p className="text-xs sm:text-sm md:text-base text-gray-500">
                      {description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <NavigationControls />
                  {actions}
                </div>
              </div>
            </div>

            {/* Page Content */}
            <div className="space-y-4 sm:space-y-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
