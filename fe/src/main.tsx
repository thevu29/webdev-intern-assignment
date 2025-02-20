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
import { ModalsProvider } from "@mantine/modals";

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
    <ModalsProvider>
      <Notifications />
      <RouterProvider router={router} />
    </ModalsProvider>
  </MantineProvider>
  // </StrictMode>
);
