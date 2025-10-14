"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";

export function NavigationControls() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  // Check if browser navigation is available
  useEffect(() => {
    const checkNavigationAvailability = () => {
      setCanGoBack(window.history.length > 1);
      setCanGoForward(window.history.state?.idx < window.history.length - 1);
    };

    checkNavigationAvailability();
    window.addEventListener("popstate", checkNavigationAvailability);

    return () => {
      window.removeEventListener("popstate", checkNavigationAvailability);
    };
  }, []);

  const handleBack = () => {
    if (canGoBack) {
      router.back();
    }
  };

  const handleForward = () => {
    if (canGoForward) {
      router.forward();
    }
  };

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBack}
        disabled={!canGoBack}
        className={cn(
          "h-8 w-8 text-gray-400 hover:text-gray-200 hover:bg-gray-800",
          !canGoBack && "opacity-50 cursor-not-allowed"
        )}
        title="Go back"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleForward}
        disabled={!canGoForward}
        className={cn(
          "h-8 w-8 text-gray-400 hover:text-gray-200 hover:bg-gray-800",
          !canGoForward && "opacity-50 cursor-not-allowed"
        )}
        title="Go forward"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleRefresh}
        className="h-8 w-8 text-gray-400 hover:text-gray-200 hover:bg-gray-800"
        title="Refresh page"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Helper function for conditional class names
function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}
