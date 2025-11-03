"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/components/home/common/ThemeProvider";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/home/header";

interface OptimizedLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function OptimizedLayout({
  children,
  title,
  description,
  actions,
  className = "",
}: OptimizedLayoutProps) {
  return (
    <ThemeProvider>
      <div
        className={`min-h-screen bg-background text-foreground ${className}`}
      >
        <div className="flex h-screen">
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header title={title} description={description} actions={actions} />

            <main className="flex-1 overflow-y-auto p-4 lg:p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
