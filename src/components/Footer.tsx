"use client"

import { useState, useEffect } from "react"
import { SITE_NAME } from "@/lib/constants"

export default function Footer() {
  const [year, setYear] = useState("2026")

  useEffect(() => {
    setYear(String(new Date().getFullYear()))
  }, [])

  return (
    <footer className="border-t border-beige bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <p className="text-sm text-hazelnut">
            &copy; {year} {SITE_NAME}. Baked with love.
          </p>
          <div className="flex gap-4 text-xs text-hazelnut/60">
            <a href="/track" className="hover:text-hazelnut underline">Track Order</a>
            <a href="mailto:hmd.cookie@protonmail.com" className="hover:text-hazelnut underline">Contact</a>
          </div>
        </div>
        <p className="text-xs text-hazelnut/50">
          Made fresh. No preservatives. Just cookies.
        </p>
      </div>
    </footer>
  )
}
