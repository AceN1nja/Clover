import { Manrope } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import Script from "next/script";
import { Providers } from "./providers";

const fontHeading = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Clover",
  description: "Job applications done right",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script src="https://accounts.google.com/gsi/client" async />
      </head>

      <body
        className={cn(
          "antialiased bg-background text-foreground",
          fontHeading.variable,
          fontBody.variable,
        )}
      >
        <Providers>
          <main className="min-h-screen flex flex-col items-center">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
