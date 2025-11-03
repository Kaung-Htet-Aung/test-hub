"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Bell, Menu } from "lucide-react";
import { useApp } from "@/contexts/app-context";
import { ReactNode } from "react";

interface HeaderProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
}

export function Header({ title, description, actions }: HeaderProps) {
  const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useApp();

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile menu button - visible only on mobile */}
        <div className="lg:hidden flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="h-10 w-10 text-gray-400 hover:text-gray-200 hover:bg-gray-800"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Title and description - takes available space */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 mx-1 sm:mx-0">
          {title && (
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg font-semibold text-gray-100 truncate">
                {title}
              </h1>
              {description && (
                <p className="text-xs sm:text-sm text-gray-400 truncate">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Search input - shown only when no title */}
          {!title && (
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search..."
                className="pl-10 w-full sm:w-60 md:w-80 bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-gray-600 focus:ring-0"
              />
            </div>
          )}

          {/* Actions */}
          {actions && <div className="flex-shrink-0 ml-2">{actions}</div>}
        </div>

        {/* User controls - fixed width */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-200 hover:bg-gray-800"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-800">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-300" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-200">John Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
