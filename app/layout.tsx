import type { Metadata } from "next";
import { Poppins, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { CartSheet } from "@/components/CartSheet";
import { QueryProvider } from "@/components/providers/QueryProvider";

const poppinsSans = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Velbuy - Your Premier Online Shopping Destination",
    template: "%s | Velbuy",
  },
  description:
    "Discover the best apparels and accessories at unbeatable prices. Shop the latest fashion trends with secure checkout and fast shipping.",
  keywords: [
    "online shopping",
    "ecommerce",
    "fashion",
    "apparels",
    "accessories",
    "clothing",
    "shopping",
  ],
  authors: [{ name: "Nick Veles", url: "https://nickveles.com" }],
  creator: "Nick Veles",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://velbuy.vercel.com",
    siteName: "Velbuy",
    title: "Velbuy - Your Premier Online Shopping Destination",
    description:
      "Discover the best apparels and accessories at unbeatable prices. Shop the latest fashion trends with secure checkout and fast shipping.",
    images: [
      {
        url: "/banner.jpg",
        width: 1200,
        height: 630,
        alt: "Velbuy Online Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Velbuy - Your Premier Online Shopping Destination",
    description:
      "Discover the best apparels and accessories at unbeatable prices.",
    images: ["/banner.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body
          className={`${poppinsSans.variable} ${robotoMono.variable} antialiased flex min-h-screen flex-col bg-background`}
        >
          <QueryProvider>
            <Toaster position="bottom-right" />
            <CartSheet />
            <Navbar />
            <main className="grow container mx-auto px-4 py-8">{children}</main>
            <Footer />
          </QueryProvider>
        </body>
      </html>
  );
}
