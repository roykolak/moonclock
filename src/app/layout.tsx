import type { Viewport } from "next";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./global.css";
import {
  ColorSchemeScript,
  createTheme,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <link rel="icon" href="/app-icon.png" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/app-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#333333" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Moonclock" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider
          forceColorScheme="dark"
          theme={createTheme({
            primaryColor: "cyan",
          })}
        >
          <Notifications position="bottom-center" />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
