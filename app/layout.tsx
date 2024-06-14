import { ThemeProvider } from "@/components/mode-provider";
import { Toaster } from "@/components/ui/toaster";
import { AppContext } from "@/context/app-context";
import type { Metadata } from "next";
import { Sen } from "next/font/google";
import "./globals.css";

const Josef = Sen({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nyumbani Administrator Portal",
  description: "Nyumbani Administrator Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={Josef.className}>
        <AppContext>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </AppContext>
      </body>
    </html>
  );
}
