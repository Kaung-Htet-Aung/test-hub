"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "@/contexts/app-context";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    title: "Participants",
    icon: Users,
    href: "/admin/participants",
  },
  {
    title: "Tests",
    icon: FileText,
    href: "/admin/tests",
  },
  {
    title: "Questions",
    icon: BookOpen,
    href: "/admin/questions",
  },
  {
    title: "Messages",
    icon: MessageSquare,
    href: "/admin/messages",
  },
  {
    title: "Reports",
    icon: TrendingUp,
    href: "/admin/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  } = useApp();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 border-r border-gray-800 bg-gray-900 transition-all duration-200",
          isSidebarCollapsed ? "lg:w-16" : "lg:w-64 w-64", // Collapsed on desktop, always 64px on mobile
          isMobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 sm:p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              {!isSidebarCollapsed && (
                <h2 className="text-lg font-medium text-gray-100">TestHub</h2>
              )}
              <div className="flex items-center gap-2">
                {/* Desktop collapse button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="hidden lg:flex h-6 w-6 text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                >
                  <div className="h-4 w-4 border-2 border-gray-400 rounded">
                    {isSidebarCollapsed ? (
                      <div className="w-2 h-2 bg-gray-400 rounded-sm m-0.5" />
                    ) : (
                      <div className="w-2 h-2 bg-gray-400 rounded-sm m-0.5 ml-auto" />
                    )}
                  </div>
                </Button>

                {/* Mobile close button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="lg:hidden h-6 w-6 text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-2 sm:p-4">
            <ul className="space-y-1">
              {sidebarItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    scroll={false}
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-gray-400 hover:text-gray-100 hover:bg-gray-800",
                        isSidebarCollapsed &&
                          "lg:justify-center lg:px-2 lg:px-3",
                        pathname === item.href && "text-gray-100 bg-gray-800"
                      )}
                    >
                      <item.icon
                        className={cn("h-4 w-4", !isSidebarCollapsed && "mr-3")}
                      />
                      {!isSidebarCollapsed && (
                        <span className="text-sm">{item.title}</span>
                      )}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
