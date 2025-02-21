// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <MantineProvider
    theme={{
      fontFamily: "Inter, sans-serif",
      headings: { fontFamily: "Inter, sans-serif" },
      components: {
        Notifications: {
          styles: {
            root: {
              zIndex: 9999,
            },
          },
        },
      },
    }}
  >
    <QueryClientProvider client={queryClient}>
      <Notifications />
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </MantineProvider>
  // </StrictMode>
);
