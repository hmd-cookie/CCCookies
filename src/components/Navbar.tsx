"use client"

import { SITE_NAME, NAV_LINKS } from "@/lib/constants"
import CartButton from "./CartButton"

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 border-b border-beige/60 bg-cream/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="/" className="text-xl font-bold tracking-tight text-espresso">
          {SITE_NAME}
        </a>

        <div className="hidden items-center gap-8 sm:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-hazelnut transition-colors hover:text-espresso"
            >
              {link.label}
            </a>
          ))}
        </div>

        <CartButton />
      </nav>
    </header>
  )
}
