"use client";
import { SyncProvider } from "@/lib/sync";

import { ReactNode } from "react";
import { AppProvider } from "@/contexts/app-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <SyncProvider>
          {children}
          <Toaster richColors />
        </SyncProvider>
      </QueryClientProvider>
    </AppProvider>
  );
}
