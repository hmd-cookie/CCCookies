"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

type Pack = {
  id: string
  name: string
  cookie_count: number
  price: number
  description: string
  popular: boolean
  savings: string | null
  active: boolean
}

export default function AdminPricingPage() {
  const router = useRouter()
  const [packs, setPacks] = useState<Pack[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState("")

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

      const res = await fetch("/api/admin/packs")
      const data = await res.json()
      setPacks(data || [])
      setLoading(false)
    }

    init()
  }, [router])

  const updatePack = async (pack: Pack) => {
    setSaving(pack.id)
    setMessage("")

    try {
      const res = await fetch("/api/admin/packs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pack),
      })

      if (res.ok) {
        setMessage("Saved!")
        setTimeout(() => setMessage(""), 2000)
      } else {
        const data = await res.json()
        setMessage(data.error || "Error saving")
      }
    } catch {
      setMessage("Error saving")
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-hazelnut">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream px-6 pt-24 pb-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-espresso">Pricing</h1>
          <a href="/admin/orders" className="text-sm font-medium text-tan hover:text-caramel underline">
            View Orders
          </a>
        </div>

        {message && (
          <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <div className="mt-6 space-y-6">
          {packs.map((pack) => (
            <EditablePackCard
              key={pack.id}
              pack={pack}
              onSave={updatePack}
              saving={saving === pack.id}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function EditablePackCard({
  pack,
  onSave,
  saving,
}: {
  pack: Pack
  onSave: (pack: Pack) => void
  saving: boolean
}) {
  const [form, setForm] = useState({ ...pack })
  const [dirty, setDirty] = useState(false)

  const handleChange = (field: keyof Pack, value: string | number | boolean | null) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setDirty(true)
  }

  return (
    <div className="rounded-2xl border border-beige bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-espresso">{form.name}</h3>
          {form.popular && (
            <span className="rounded-full bg-caramel px-3 py-0.5 text-xs font-medium text-espresso">
              Popular
            </span>
          )}
          <label className="flex cursor-pointer items-center gap-1.5 text-xs text-hazelnut">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => handleChange("active", e.target.checked)}
              className="h-3.5 w-3.5 accent-tan"
            />
            Active
          </label>
        </div>
        <button
          onClick={() => onSave(form)}
          disabled={!dirty || saving}
          className="rounded-full bg-tan px-4 py-1.5 text-sm font-medium text-espresso hover:bg-caramel disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-hazelnut">Name</label>
          <input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="mt-1 w-full rounded-lg border border-beige bg-cream px-3 py-2 text-sm text-espresso outline-none focus:border-tan"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-hazelnut">
            Price (cents) — e.g. 1499 = $14.99
          </label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => handleChange("price", parseInt(e.target.value) || 0)}
            className="mt-1 w-full rounded-lg border border-beige bg-cream px-3 py-2 text-sm text-espresso outline-none focus:border-tan"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-hazelnut">Cookie Count</label>
          <input
            type="number"
            value={form.cookie_count}
            onChange={(e) => handleChange("cookie_count", parseInt(e.target.value) || 0)}
            className="mt-1 w-full rounded-lg border border-beige bg-cream px-3 py-2 text-sm text-espresso outline-none focus:border-tan"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-hazelnut">Savings text (e.g. &quot;Save $1.99&quot;)</label>
          <input
            value={form.savings || ""}
            onChange={(e) => handleChange("savings", e.target.value || null)}
            className="mt-1 w-full rounded-lg border border-beige bg-cream px-3 py-2 text-sm text-espresso outline-none focus:border-tan"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-hazelnut">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={2}
            className="mt-1 w-full resize-none rounded-lg border border-beige bg-cream px-3 py-2 text-sm text-espresso outline-none focus:border-tan"
          />
        </div>
        <div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-hazelnut">
            <input
              type="checkbox"
              checked={form.popular}
              onChange={(e) => handleChange("popular", e.target.checked)}
              className="h-4 w-4 accent-tan"
            />
            Mark as &quot;Most Popular&quot;
          </label>
        </div>
      </div>
    </div>
  )
}
