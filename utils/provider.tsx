"use client";

import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { ThemeProvider } from "@/components/theme-provider";

function Providers({ children }: React.PropsWithChildren) {
  const [client] = React.useState(new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <ReactQueryStreamedHydration>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </ReactQueryStreamedHydration>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default Providers;
