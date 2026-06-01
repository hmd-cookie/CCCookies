"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/store/cart"

type Pack = {
  id: string
  name: string
  cookie_count: number
  price: number
  description: string
  popular: boolean
  savings: string | null
}

export default function OrderSection() {
  const { addItem, openCart } = useCart()
  const [packs, setPacks] = useState<Pack[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/packs")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPacks(data)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = (pack: Pack) => {
    addItem({
      id: pack.id,
      name: pack.name,
      price: pack.price / 100, // convert cents to dollars for display
      quantity: 1,
    })
    openCart()
  }

  if (loading) {
    return (
      <section id="order" className="border-t border-beige px-6 py-24">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-hazelnut">Loading packs...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="order" className="border-t border-beige px-6 py-24">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold text-espresso sm:text-4xl">
          Choose Your Pack
        </h2>
        <p className="mt-4 text-lg text-hazelnut">
          Baked fresh after you order. Eggless, vegetarian, and always delicious.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className={`relative rounded-2xl border-2 bg-cream p-8 text-left shadow-sm transition-shadow hover:shadow-md ${
                pack.popular
                  ? "border-caramel ring-1 ring-caramel/20"
                  : "border-beige"
              }`}
            >
              {pack.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-caramel px-4 py-1 text-xs font-semibold text-espresso shadow-sm">
                  Most Popular
                </span>
              )}

              <div className="mb-4">
                <p className="text-sm font-medium uppercase tracking-wider text-hazelnut">
                  {pack.cookie_count} cookies
                </p>
                <h3 className="mt-1 text-xl font-bold text-espresso">
                  {pack.name}
                </h3>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-hazelnut">
                {pack.description}
              </p>

              <div className="mb-6">
                <p className="text-3xl font-bold text-espresso">
                  ${(pack.price / 100).toFixed(2)}
                </p>
                <p className="mt-1 text-sm text-hazelnut">
                  ${(pack.price / 100 / pack.cookie_count).toFixed(2)} per cookie
                </p>
              </div>

              {pack.savings && (
                <p className="mb-4 text-sm font-medium text-green-700">
                  {pack.savings}
                </p>
              )}

              <button
                onClick={() => handleAdd(pack)}
                className={`w-full rounded-full px-6 py-3 text-base font-semibold transition-colors ${
                  pack.popular
                    ? "bg-tan text-espresso hover:bg-caramel"
                    : "border-2 border-tan text-espresso hover:bg-beige"
                }`}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-hazelnut/60">
          All cookies are baked fresh after your order is placed. We use real butter,
          70% dark chocolate, and no eggs — ever.
        </p>
      </div>
    </section>
  )
}
