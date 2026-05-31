"use client"

import CookieScene from "@/components/CookieScene"
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants"

export default function CookieHero() {
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
            Eggless &bull; Vegetarian &bull; Baked fresh after you order
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            <a
              href="#order"
              className="rounded-full bg-tan px-8 py-3 text-base font-semibold text-espresso transition-colors hover:bg-caramel"
            >
              Order Now
            </a>
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
