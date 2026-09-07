import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Rethink_Sans } from "next/font/google";
import localFont from "next/font/local";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth";

const rethinkSans = Rethink_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-rethink",
  display: "swap",
});

const bitApple = localFont({
  src: "../../public/fonts/Bit-Apple-font.woff2",
  variable: "--font-bit-apple",
  display: "swap",
  // Bit Apple is a pixel face with tight metrics; matching the fallback keeps
  // the swap from shifting the hero headline.
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vestucla.com"),
  title: {
    default: "VEST at UCLA",
    template: "%s — VEST at UCLA",
  },
  description:
    "VEST is UCLA's startup and builder community — cultivating the founders, engineers and designers coming out of Westwood.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "VEST at UCLA",
    description: "Scaling builder culture at UCLA.",
    url: "/",
    siteName: "VEST at UCLA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${rethinkSans.variable} ${bitApple.variable}`}>
      <body>
        <AuthProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-btn focus:bg-blue focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
          >
            Skip to content
          </a>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </AuthProvider>
        <Toaster position="top-right" theme="light" />
      </body>
    </html>
  );
}
