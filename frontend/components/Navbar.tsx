"use client";

import { useState } from "react";

const NAV_LINKS = [
  { href: "#profil", label: "Profil" },
  { href: "#program", label: "Program Kerja" },
  { href: "#dokumentasi", label: "Dokumentasi" },
  { href: "#galeri", label: "Galeri" },
  { href: "#kontak", label: "Kontak" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F7F4ED]/90 backdrop-blur-sm border-b border-[#2C3B2E]/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-[#C08A2E] bg-white p-0.5 shadow-sm">
            <img
              src="/logo-kkn.png"
              alt="Logo KKN Rancamanyar"
              className="h-full w-full rounded-full object-contain"
              decoding="async"
              onError={(event) => {
                const target = event.currentTarget as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.parentElement?.querySelector("span");
                if (fallback) {
                  fallback.classList.remove("hidden");
                }
              }}
            />
            <span className="hidden font-display text-sm font-semibold text-[#2C3B2E]">
              KKN
            </span>
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">
            Rancamanyar
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4A5D45]">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden text-[#2C3B2E]"
          aria-label="Buka menu"
          aria-expanded={menuOpen}
          aria-controls="mobileMenu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      <nav
        id="mobileMenu"
        className={`md:hidden ${menuOpen ? "flex" : "hidden"} flex-col gap-1 px-6 pb-4 text-sm font-medium text-[#4A5D45]`}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="block py-2"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
