"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const STATUS_FLOW = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "paid", label: "Paid", color: "bg-blue-100 text-blue-800" },
  { value: "confirmed", label: "Confirmed", color: "bg-purple-100 text-purple-800" },
  { value: "baking", label: "Baking", color: "bg-orange-100 text-orange-800" },
  { value: "shipped", label: "Shipped", color: "bg-green-100 text-green-800" },
  { value: "ready", label: "Ready for Pickup", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
]

type OrderItem = {
  id: string
  pack_id: string
  name: string
  quantity: number
  price: number
}

type Order = {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  address_line1: string | null
  address_city: string | null
  address_state: string | null
  address_postal: string | null
  address_country: string | null
  delivery_option: string
  delivery_fee: number
  status: string
  total: number
  notes: string | null
  created_at: string
  updated_at: string
  order_items: OrderItem[]
}

export default function AdminOrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/admin")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (profile?.role !== "admin") {
        router.push("/admin")
        return
      }

      const res = await fetch(`/api/admin/orders`)
      const data = await res.json()
      const found = (data.orders || []).find(
        (o: Order) => o.id === params.id,
      )
      setOrder(found || null)
      setLoading(false)
    }

    init()
  }, [params.id, router])

  const updateStatus = async (status: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${params.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        setOrder((prev) => (prev ? { ...prev, status } : prev))
      }
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-hazelnut">Loading...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-hazelnut">Order not found</p>
          <a href="/admin/orders" className="mt-4 inline-block text-sm text-tan underline">
            Back to Orders
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream px-6 pt-24 pb-12">
      <div className="mx-auto max-w-3xl">
        <a href="/admin/orders" className="text-sm text-tan hover:text-caramel underline">
          &larr; Back to Orders
        </a>

        <h1 className="mt-4 text-2xl font-bold text-espresso">
          Order {order.id.slice(0, 8)}...
        </h1>

        {/* Status */}
        <div className="mt-6 rounded-2xl border border-beige bg-white p-6">
          <h2 className="text-lg font-semibold text-espresso">Status</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {STATUS_FLOW.map((s) => (
              <button
                key={s.value}
                onClick={() => updateStatus(s.value)}
                disabled={updating}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  order.status === s.value
                    ? `${s.color} ring-2 ring-tan`
                    : "bg-beige/50 text-hazelnut hover:bg-beige"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Info */}
        <div className="mt-6 rounded-2xl border border-beige bg-white p-6">
          <h2 className="text-lg font-semibold text-espresso">Customer</h2>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-hazelnut">Name</p>
              <p className="font-medium text-espresso">{order.customer_name}</p>
            </div>
            <div>
              <p className="text-hazelnut">Email</p>
              <p className="font-medium text-espresso">{order.customer_email}</p>
            </div>
            <div>
              <p className="text-hazelnut">Phone</p>
              <p className="font-medium text-espresso">{order.customer_phone}</p>
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div className="mt-6 rounded-2xl border border-beige bg-white p-6">
          <h2 className="text-lg font-semibold text-espresso">Delivery</h2>
          <div className="mt-4 space-y-2 text-sm">
            <p className="capitalize">
              <span className="text-hazelnut">Method:</span>{" "}
              <span className="font-medium text-espresso">
                {order.delivery_option === "pickup"
                  ? "Local Pickup"
                  : order.delivery_option === "brampton"
                    ? "Brampton Delivery"
                    : "GTA Delivery"}
              </span>
            </p>
            {order.delivery_option !== "pickup" && (
              <div className="mt-2">
                <p className="text-hazelnut">Address:</p>
                <p className="font-medium text-espresso">
                  {order.address_line1}<br />
                  {order.address_city}, {order.address_state} {order.address_postal}<br />
                  {order.address_country}
                </p>
              </div>
            )}
            <p>
              <span className="text-hazelnut">Delivery Fee:</span>{" "}
              <span className="font-medium text-espresso">
                ${(order.delivery_fee / 100).toFixed(2)}
              </span>
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="mt-6 rounded-2xl border border-beige bg-white p-6">
          <h2 className="text-lg font-semibold text-espresso">Items</h2>
          <div className="mt-4 space-y-3">
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-espresso">{item.name}</p>
                  <p className="text-sm text-hazelnut">×{item.quantity}</p>
                </div>
                <p className="font-medium text-espresso">
                  ${(item.price * item.quantity / 100).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-beige pt-4 flex justify-between font-bold text-espresso">
            <span>Total</span>
            <span>${(order.total / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
