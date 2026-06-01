import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    // --- Phase 3: Verify Stripe webhook signature ---
    // const event = Stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET)

    // For now, parse raw JSON (to be replaced with Stripe verification)
    const payload = JSON.parse(body)

    // Handle checkout.session.completed
    if (payload.type === "checkout.session.completed") {
      const session = payload.data.object

      const supabase = createAdminClient()

      await supabase
        .from("orders")
        .update({
          status: "paid",
          stripe_session_id: session.id,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_session_id", session.id)

      // --- Phase 3: Send confirmation emails via Resend ---
      // await sendOrderConfirmationEmail(session)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("Webhook error:", err)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
