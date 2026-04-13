import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  title: "AI Trend Auto Publisher",
  description: "Automation-ready trend discovery and publishing dashboard."
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${ibmPlexMono.variable}`} style={{ fontFamily: "var(--font-sans)" }}>
        <div className="app-shell">
          <div className="ambient-orb orb-one" />
          <div className="ambient-orb orb-two" />
          <div className="ambient-orb orb-three" />
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
