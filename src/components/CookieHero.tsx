"use client"

import dynamic from "next/dynamic"
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants"
import { useCart } from "@/store/cart"

const CookieScene = dynamic(() => import("@/components/CookieScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="h-32 w-32 animate-pulse rounded-full bg-beige" />
    </div>
  ),
})

export default function CookieHero() {
  const { addItem, openCart } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: "ccc-original",
      name: "Classic Chocolate Chip Cookie",
      price: 4.99,
      quantity: 1,
    })
    openCart()
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-beige/30 to-cream pointer-events-none" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-8 lg:flex-row lg:gap-16">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-espresso sm:text-5xl lg:text-6xl">
            {SITE_NAME}
          </h1>
          <p className="mt-4 text-lg text-hazelnut sm:text-xl">
            {SITE_TAGLINE}
          </p>
          <p className="mt-2 text-sm text-hazelnut/70">
            Every batch baked fresh. No shortcuts. Just butter, sugar, and love.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            <button
              onClick={handleAddToCart}
              className="rounded-full bg-tan px-8 py-3 text-base font-semibold text-espresso transition-colors hover:bg-caramel"
            >
              Add to Cart — $4.99
            </button>
            <a
              href="#about"
              className="rounded-full border border-tan px-8 py-3 text-base font-medium text-hazelnut transition-colors hover:bg-beige"
            >
              Learn More
            </a>
          </div>
        </div>

        <div className="flex-1 h-[400px] w-full sm:h-[500px] lg:h-[600px]">
          <CookieScene />
        </div>
      </div>
    </section>
  )
}
