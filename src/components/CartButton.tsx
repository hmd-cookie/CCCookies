"use client"

import { useCart } from "@/store/cart"

export default function CartButton() {
  const { toggleCart, totalItems, hydrated } = useCart()
  const count = hydrated ? totalItems() : 0

  return (
    <button
      onClick={toggleCart}
      className="relative flex items-center gap-2 rounded-full bg-tan px-4 py-2 text-sm font-medium text-espresso transition-colors hover:bg-caramel"
      aria-label="Open cart"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      <span className="hidden sm:inline">Cart</span>
      {count > 0 && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-espresso text-[11px] font-bold text-cream">
          {count}
        </span>
      )}
    </button>
  )
}
