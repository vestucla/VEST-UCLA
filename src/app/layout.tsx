import Layout from "@/components/Layout";
import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { GeistSans } from "geist/font/sans";
import { Playfair_Display } from "next/font/google";
import localFont from "next/font/local";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair-display",
  display: "swap",
});

const bitApple = localFont({
  src: "../../public/Bit-Apple-font.woff2",
  variable: "--font-bit-apple",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VEST at UCLA",
  description: "Scaling builder culture at UCLA",
  icons: {
    icon: "/images/VEST-logo-white.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.className} ${playfairDisplay.variable} ${bitApple.variable}`}>
      <body>
        <Layout>{children}</Layout>
        <Toaster position="top-right" theme="dark" />
      </body>
    </html>
  );
}
