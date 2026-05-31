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
        <p className="text-sm text-hazelnut">
          &copy; {year} {SITE_NAME}. Baked with love.
        </p>
        <p className="text-xs text-hazelnut/50">
          Made fresh. No preservatives. Just cookies.
        </p>
      </div>
    </footer>
  )
}
