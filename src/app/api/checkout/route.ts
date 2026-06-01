import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

const DELIVERY_FEES: Record<string, number> = {
  pickup: 0,
  brampton: 399,
  gta: 699,
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, customer, delivery } = body

    // --- Validation ---
    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }
    if (!customer?.name || !customer?.email || !customer?.phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 },
      )
    }
    if (!delivery?.option || !["pickup", "brampton", "gta"].includes(delivery.option)) {
      return NextResponse.json({ error: "Invalid delivery option" }, { status: 400 })
    }
    if (delivery.option !== "pickup") {
      if (!delivery.address?.line1 || !delivery.address?.city || !delivery.address?.postal) {
        return NextResponse.json(
          { error: "Delivery address is required" },
          { status: 400 },
        )
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customer.email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const phoneRegex = /^[\d\s\-+()]{7,20}$/
    if (!phoneRegex.test(customer.phone)) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 })
    }

    // --- Verify prices against DB ---
    const supabase = createAdminClient()

    const { data: packs } = await supabase
      .from("packs")
      .select("id, price")
      .in("id", items.map((i: { id: string }) => i.id))

    if (!packs) {
      return NextResponse.json({ error: "Failed to verify packs" }, { status: 500 })
    }

    const packPriceMap = new Map(packs.map((p) => [p.id, p.price]))

    let subtotal = 0
    const verifiedItems = []

    for (const item of items) {
      const dbPrice = packPriceMap.get(item.id)
      if (!dbPrice) {
        return NextResponse.json(
          { error: `Invalid pack: ${item.id}` },
          { status: 400 },
        )
      }
      if (typeof item.quantity !== "number" || item.quantity < 1) {
        return NextResponse.json({ error: "Invalid quantity" }, { status: 400 })
      }
      subtotal += dbPrice * item.quantity
      verifiedItems.push({
        pack_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: dbPrice,
      })
    }

    const deliveryFee = DELIVERY_FEES[delivery.option]
    const total = subtotal + deliveryFee

    // --- Create order in Supabase ---
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customer.name.trim(),
        customer_email: customer.email.trim().toLowerCase(),
        customer_phone: customer.phone.trim(),
        address_line1: delivery.address?.line1?.trim() || null,
        address_city: delivery.address?.city?.trim() || null,
        address_state: delivery.address?.state?.trim() || null,
        address_postal: delivery.address?.postal?.trim() || null,
        address_country: delivery.address?.country?.trim() || "Canada",
        delivery_option: delivery.option,
        delivery_fee: deliveryFee,
        total,
        status: "pending",
      })
      .select("id")
      .single()

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    // --- Create order items ---
    const { error: itemsError } = await supabase.from("order_items").insert(
      verifiedItems.map((item) => ({ ...item, order_id: order.id })),
    )

    if (itemsError) {
      await supabase.from("orders").delete().eq("id", order.id)
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    // --- Stripe Checkout session (Phase 3) ---
    // When Stripe keys are configured, create a session here and return the URL
    // For now, order is saved — will redirect to success page

    return NextResponse.json({
      orderId: order.id,
      url: `/order/success?order=${order.id}`,
    })
  } catch (err) {
    console.error("Checkout error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
