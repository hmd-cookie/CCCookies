"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order")
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-20">
      <div className="max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="mt-6 text-3xl font-bold text-espresso">Order Placed!</h1>
        <p className="mt-3 text-hazelnut">
          Thank you for your order! We&apos;ll start baking your cookies fresh.
          You&apos;ll receive a confirmation email shortly.
        </p>

        {orderId && (
          <div className="mt-6 rounded-xl border border-beige bg-cream p-4">
            <p className="text-sm text-hazelnut">Order ID</p>
            <div className="mt-1 flex items-center justify-center gap-2">
              <code className="text-sm font-mono text-espresso">{orderId}</code>
              <button
                onClick={handleCopy}
                className="text-xs text-tan hover:text-caramel underline"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={`/track?order=${orderId}`}
            className="rounded-full bg-tan px-6 py-2 font-medium text-espresso hover:bg-caramel"
          >
            Track Your Order
          </a>
          <a
            href="/"
            className="rounded-full border border-tan px-6 py-2 font-medium text-hazelnut hover:bg-beige"
          >
            Back to Home
          </a>
        </div>

        <p className="mt-6 text-xs text-hazelnut/60">
          For questions, contact{" "}
          <a href="mailto:hmd.cookie@protonmail.com" className="underline">
            hmd.cookie@protonmail.com
          </a>
        </p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p className="text-hazelnut">Loading...</p></div>}>
      <SuccessContent />
    </Suspense>
  )
}
