"use client"

import { useState } from "react"

type OrderStatus = "pending" | "paid" | "confirmed" | "baking" | "shipped" | "ready" | "cancelled"

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Order Received",
  paid: "Payment Confirmed",
  confirmed: "Order Confirmed",
  baking: "Baking...",
  shipped: "Shipped",
  ready: "Ready for Pickup",
  cancelled: "Cancelled",
}

const STATUS_ORDER: OrderStatus[] = ["pending", "paid", "confirmed", "baking", "shipped", "ready"]

type OrderData = {
  id: string
  customer_name: string
  customer_email: string
  delivery_option: string
  status: OrderStatus
  total: number
  created_at: string
  order_items: { name: string; quantity: number; price: number }[]
}

export default function TrackPage() {
  const [orderId, setOrderId] = useState("")
  const [email, setEmail] = useState("")
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/track?order=${encodeURIComponent(orderId)}&email=${encodeURIComponent(email)}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Order not found")
        setOrder(null)
        return
      }

      setOrder(data)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIndex = (status: OrderStatus) => {
    return STATUS_ORDER.indexOf(status)
  }

  return (
    <div className="min-h-screen bg-cream px-6 pt-24 pb-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-center text-3xl font-bold text-espresso">Track Your Order</h1>
        <p className="mt-2 text-center text-hazelnut">Enter your order ID and email to check the status.</p>

        <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            required
            placeholder="Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 rounded-xl border border-beige bg-white px-4 py-3 text-espresso outline-none focus:border-tan"
          />
          <input
            required
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-xl border border-beige bg-white px-4 py-3 text-espresso outline-none focus:border-tan"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-tan px-6 py-3 font-medium text-espresso hover:bg-caramel disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {order && (
          <div className="mt-8 rounded-2xl border border-beige bg-white p-6">
            {/* Status Timeline */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                {STATUS_ORDER.map((s, i) => {
                  const currentIdx = getStatusIndex(order.status)
                  const isReached = i <= currentIdx
                  const isCancelled = order.status === "cancelled"

                  return (
                    <div key={s} className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                          isCancelled && s === "pending"
                            ? "bg-red-100 text-red-600"
                            : isReached
                              ? "bg-tan text-espresso"
                              : "bg-beige text-hazelnut/50"
                        }`}
                      >
                        {isReached && !isCancelled ? (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : (
                          i + 1
                        )}
                      </div>
                      <p className={`mt-1 text-[10px] font-medium ${isReached ? "text-espresso" : "text-hazelnut/50"}`}>
                        {STATUS_LABELS[s]}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="border-t border-beige pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-hazelnut">Current Status</span>
                <span className="font-medium text-espresso">{STATUS_LABELS[order.status]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-hazelnut">Delivery</span>
                <span className="font-medium text-espresso capitalize">{order.delivery_option}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-hazelnut">Total</span>
                <span className="font-medium text-espresso">${(order.total / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-hazelnut">Placed On</span>
                <span className="font-medium text-espresso">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="border-t border-beige pt-2 mt-2">
                <p className="text-hazelnut mb-1">Items</p>
                {order.order_items.map((item, i) => (
                  <div key={i} className="flex justify-between text-espresso">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
