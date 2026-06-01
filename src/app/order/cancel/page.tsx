export default function CancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-20">
      <div className="max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-beige">
          <svg className="h-8 w-8 text-hazelnut" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="mt-6 text-3xl font-bold text-espresso">Payment Cancelled</h1>
        <p className="mt-3 text-hazelnut">
          Your payment was cancelled. No charges were made. Your cart items are still saved.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href="/checkout"
            className="rounded-full bg-tan px-6 py-2 font-medium text-espresso hover:bg-caramel"
          >
            Try Again
          </a>
          <a
            href="/"
            className="rounded-full border border-tan px-6 py-2 font-medium text-hazelnut hover:bg-beige"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
