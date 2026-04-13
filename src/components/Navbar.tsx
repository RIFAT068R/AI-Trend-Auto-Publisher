"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/history", label: "History" }
] as const satisfies ReadonlyArray<{ href: Route; label: string }>;

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="container">
        <nav className="nav-shell">
          <Link href="/" className="brand" aria-label="AI Trend Auto Publisher home">
            <div className="brand-row">
              <span className="brand-mark">AI</span>
              <div className="brand">
                <strong className="brand-title">AI Trend Auto Publisher</strong>
                <span className="brand-subtitle">Automation workspace for trend discovery and content ops</span>
              </div>
            </div>
          </Link>

          <div className="nav-links">
            {links.map((link) => {
              const active = pathname === link.href;

              return (
                <Link key={link.href} href={link.href} className={`nav-link${active ? " active" : ""}`}>
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
