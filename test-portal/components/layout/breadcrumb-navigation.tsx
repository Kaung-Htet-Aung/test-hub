"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

export function BreadcrumbNavigation() {
  const pathname = usePathname();

  // Generate breadcrumb items based on current path
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    if (pathname === "/admin") {
      return [{ label: "Dashboard", href: "/admin", current: true }];
    }

    const segments = pathname.split("/").filter(Boolean);
    const segmentsWithouAdmin = segments.slice(1);
    const items: BreadcrumbItem[] = [{ label: "Dashboard", href: "/admin" }];

    segmentsWithouAdmin.forEach((segment, index) => {
      const href = "/" + segments.slice(1, index + 1).join("/");
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      items.push({
        label,
        href,
        current: index === segments.length - 1,
      });
    });

    return items;
  };

  const items = getBreadcrumbItems();

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-1 text-sm"
    >
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-500 mx-2 flex-shrink-0" />
          )}

          {index === 0 ? (
            <Link
              href={item.href}
              className={cn(
                "flex items-center text-gray-400 hover:text-gray-200 transition-colors",
                item.current && "text-gray-200"
              )}
            >
              <Home className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">Home</span>
            </Link>
          ) : (
            <Link
              href={item.href}
              className={cn(
                "text-gray-400 hover:text-gray-200 transition-colors",
                item.current && "text-gray-200 font-medium"
              )}
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
