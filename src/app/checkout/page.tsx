"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/store/cart"
import type { Pack } from "@/lib/constants"

type DeliveryOption = "pickup" | "brampton" | "gta"

const DELIVERY_LABELS: Record<DeliveryOption, string> = {
  pickup: "Local Pickup — Free",
  brampton: "Brampton Delivery — $3.99",
  gta: "GTA Delivery — $6.99",
}

const DELIVERY_FEES: Record<DeliveryOption, number> = {
  pickup: 0,
  brampton: 399,
  gta: 699,
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()

  const [packs, setPacks] = useState<Pack[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [delivery, setDelivery] = useState<DeliveryOption>("pickup")
  const [address, setAddress] = useState({ line1: "", city: "", state: "", postal: "", country: "Canada" })

  useEffect(() => {
    fetch("/api/packs")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPacks(data)
      })
      .finally(() => setLoading(false))
  }, [])

  const subtotal = items.reduce((sum, item) => {
    const pack = packs.find((p) => p.id === item.id)
    return sum + (pack ? pack.price : 0) * item.quantity
  }, 0)

  const deliveryFee = DELIVERY_FEES[delivery]
  const total = subtotal + deliveryFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity })),
          customer: { name, email, phone },
          delivery: {
            option: delivery,
            address: delivery !== "pickup" ? address : null,
          },
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong")
        return
      }

      clearCart()
      router.push(data.url)
    } catch {
      setError("Failed to place order. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-espresso">Your cart is empty</h1>
          <p className="mt-2 text-hazelnut">Add some cookies before checking out.</p>
          <a href="/" className="mt-6 inline-block rounded-full bg-tan px-6 py-2 font-medium text-espresso hover:bg-caramel">
            Go Shopping
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream px-6 pt-24 pb-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-espresso">Checkout</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {/* Order Summary */}
          <section className="rounded-2xl border border-beige bg-white p-6">
            <h2 className="text-lg font-semibold text-espresso">Order Summary</h2>
            <ul className="mt-4 space-y-3">
              {items.map((item) => {
                const pack = packs.find((p) => p.id === item.id)
                return (
                  <li key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-espresso">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-espresso">
                      ${(pack ? pack.price * item.quantity : 0) / 100}
                    </span>
                  </li>
                )
              })}
            </ul>
            <div className="mt-4 border-t border-beige pt-4 space-y-1 text-sm">
              <div className="flex justify-between text-hazelnut">
                <span>Delivery</span>
                <span>{delivery === "pickup" ? "Free" : `$${(deliveryFee / 100).toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-semibold text-espresso">
                <span>Total</span>
                <span>${(total / 100).toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Customer Info */}
          <section className="rounded-2xl border border-beige bg-white p-6">
            <h2 className="text-lg font-semibold text-espresso">Your Information</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-espresso">Full Name *</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-beige bg-cream px-4 py-2 text-espresso outline-none focus:border-tan" />
              </div>
              <div>
                <label className="block text-sm font-medium text-espresso">Email *</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-beige bg-cream px-4 py-2 text-espresso outline-none focus:border-tan" />
              </div>
              <div>
                <label className="block text-sm font-medium text-espresso">Phone *</label>
                <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-lg border border-beige bg-cream px-4 py-2 text-espresso outline-none focus:border-tan" />
              </div>
            </div>
          </section>

          {/* Delivery */}
          <section className="rounded-2xl border border-beige bg-white p-6">
            <h2 className="text-lg font-semibold text-espresso">Delivery</h2>
            <div className="mt-4 grid gap-3">
              {(["pickup", "brampton", "gta"] as const).map((opt) => (
                <label
                  key={opt}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                    delivery === opt ? "border-tan bg-tan/10" : "border-beige bg-cream"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={opt}
                    checked={delivery === opt}
                    onChange={() => setDelivery(opt)}
                    className="h-4 w-4 accent-tan"
                  />
                  <span className="text-sm font-medium text-espresso">{DELIVERY_LABELS[opt]}</span>
                </label>
              ))}
            </div>

            {delivery !== "pickup" && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-espresso">Address Line 1 *</label>
                  <input required value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} className="mt-1 w-full rounded-lg border border-beige bg-cream px-4 py-2 text-espresso outline-none focus:border-tan" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-espresso">City *</label>
                  <input required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="mt-1 w-full rounded-lg border border-beige bg-cream px-4 py-2 text-espresso outline-none focus:border-tan" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-espresso">Province / State *</label>
                  <input required value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="mt-1 w-full rounded-lg border border-beige bg-cream px-4 py-2 text-espresso outline-none focus:border-tan" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-espresso">Postal Code *</label>
                  <input required value={address.postal} onChange={(e) => setAddress({ ...address, postal: e.target.value })} className="mt-1 w-full rounded-lg border border-beige bg-cream px-4 py-2 text-espresso outline-none focus:border-tan" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-espresso">Country</label>
                  <input value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} className="mt-1 w-full rounded-lg border border-beige bg-cream px-4 py-2 text-espresso outline-none focus:border-tan" />
                </div>
              </div>
            )}
          </section>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-tan px-8 py-3 text-lg font-semibold text-espresso transition-colors hover:bg-caramel disabled:opacity-50"
          >
            {submitting ? "Placing Order..." : "Place Order — Pay with Card"}
          </button>

          <p className="text-center text-xs text-hazelnut/60">
            Your payment is processed securely via Stripe. We never store your card details.
          </p>
        </form>
      </div>
    </div>
  )
}
