import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get("order")
  const email = searchParams.get("email")

  if (!orderId || !email) {
    return NextResponse.json(
      { error: "Order ID and email are required" },
      { status: 400 },
    )
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("orders")
    .select("id, customer_name, customer_email, delivery_option, status, total, created_at, order_items(*)")
    .eq("id", orderId)
    .eq("customer_email", email.toLowerCase())
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  return NextResponse.json(data)
}
