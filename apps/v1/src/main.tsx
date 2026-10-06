import "./index.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Page } from "./Page";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found");

// Same defaults as the web app's lib/query-client.ts.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Theme>
        <Page />
      </Theme>
    </QueryClientProvider>
  </StrictMode>,
);
