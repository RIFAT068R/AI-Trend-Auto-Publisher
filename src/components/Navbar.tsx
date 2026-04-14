"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Container } from "@/components/Container";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/history", label: "History" }
] as const satisfies ReadonlyArray<{ href: Route; label: string }>;

export function Navbar() {
  const pathname = usePathname();

  const isActiveRoute = (href: Route) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="site-header">
      <Container>
        <nav className="navbar glass-panel">
          <Link href="/" className="brand-link" aria-label="AI Trend Auto Publisher dashboard">
            <span className="brand-mark">AI</span>
            <span className="brand-copy">
              <strong>AI Trend Auto Publisher</strong>
              <span>Automated AI Content Engine</span>
            </span>
          </Link>

          <div className="nav-links" aria-label="Primary navigation">
            {links.map((link) => {
              const active = isActiveRoute(link.href);

              return (
                <Link key={link.href} href={link.href} className={`nav-link${active ? " active" : ""}`}>
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </Container>
    </header>
  );
}
