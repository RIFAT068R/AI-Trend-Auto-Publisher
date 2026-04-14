import type { Metadata } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans"
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "AI Trend Auto Publisher",
  description: "Automated AI Content Engine"
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${jetbrainsMono.variable}`}>
        <div className="site-bg" aria-hidden="true">
          <div className="bg-orb bg-orb-one" />
          <div className="bg-orb bg-orb-two" />
          <div className="bg-grid" />
        </div>
        <div className="app-shell">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
