import type { Metadata } from "next";
import {
  ColorSchemeScript,
  createTheme,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider
          forceColorScheme="dark"
          theme={createTheme({
            primaryColor: "cyan",
          })}
        >
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
