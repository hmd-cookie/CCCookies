"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  confirmed: "bg-purple-100 text-purple-800",
  baking: "bg-orange-100 text-orange-800",
  shipped: "bg-green-100 text-green-800",
  ready: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

type Order = {
  id: string
  customer_name: string
  customer_email: string
  delivery_option: string
  status: string
  total: number
  created_at: string
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setAuthenticated(false)
        router.push("/admin")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (profile?.role !== "admin") {
        setAuthenticated(false)
        router.push("/admin")
        return
      }

      setAuthenticated(true)
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    if (!authenticated) return

    const fetchOrders = async () => {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.set("status", statusFilter)
      if (search) params.set("search", search)

      const res = await fetch(`/api/admin/orders?${params}`)
      const data = await res.json()
      setOrders(data.orders || [])
      setLoading(false)
    }

    fetchOrders()
  }, [authenticated, statusFilter, search])

  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-hazelnut">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream px-6 pt-24 pb-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-espresso">Orders</h1>
          <a href="/admin/pricing" className="text-sm font-medium text-tan hover:text-caramel underline">
            Manage Pricing
          </a>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-beige bg-white px-4 py-2 text-sm text-espresso outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="confirmed">Confirmed</option>
            <option value="baking">Baking</option>
            <option value="shipped">Shipped</option>
            <option value="ready">Ready for Pickup</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border border-beige bg-white px-4 py-2 text-sm text-espresso outline-none focus:border-tan"
          />
        </div>

        {loading ? (
          <p className="mt-8 text-center text-hazelnut">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-hazelnut">No orders found</p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-beige bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-beige bg-cream">
                  <th className="px-4 py-3 font-medium text-espresso">Customer</th>
                  <th className="px-4 py-3 font-medium text-espresso">Items</th>
                  <th className="px-4 py-3 font-medium text-espresso">Delivery</th>
                  <th className="px-4 py-3 font-medium text-espresso">Total</th>
                  <th className="px-4 py-3 font-medium text-espresso">Status</th>
                  <th className="px-4 py-3 font-medium text-espresso">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                    className="cursor-pointer border-b border-beige last:border-0 hover:bg-cream/50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-espresso">{order.customer_name}</p>
                      <p className="text-xs text-hazelnut">{order.customer_email}</p>
                    </td>
                    <td className="px-4 py-3 text-hazelnut">
                      {(order as unknown as { order_items?: { name: string; quantity: number }[] }).order_items?.map?.((i) =>
                        `${i.name} ×${i.quantity}`
                      ).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3 capitalize text-hazelnut">{order.delivery_option}</td>
                    <td className="px-4 py-3 font-medium text-espresso">
                      ${(order.total / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status] || ""}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-hazelnut">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
