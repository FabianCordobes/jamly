"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState, useEffect } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [showDevtools, setShowDevtools] = useState(false);

  useEffect(() => {
    setShowDevtools(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="es">
        <body>
          {children}
          {showDevtools && <ReactQueryDevtools initialIsOpen={false} />}
        </body>
      </html>
    </QueryClientProvider>
  );
}
