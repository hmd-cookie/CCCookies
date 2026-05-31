export default function AboutSection() {
  return (
    <section
      id="about"
      className="border-t border-beige bg-beige/30 px-6 py-24"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-espresso sm:text-4xl">
          What Makes Our Cookies Special
        </h2>
        <p className="mt-4 text-lg text-hazelnut">
          100% eggless, vegetarian, and vegan-friendly. Made with real ingredients — no preservatives, no shortcuts.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          <div className="rounded-2xl bg-cream p-6 shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-tan/20">
              <svg
                className="h-6 w-6 text-tan"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-espresso">
              Premium Ingredients
            </h3>
            <p className="mt-2 text-sm text-hazelnut">
              100% eggless. Made with rich dark chocolate, salted butter, and
              premium flour. Nothing artificial.
            </p>
          </div>

          <div className="rounded-2xl bg-cream p-6 shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-tan/20">
              <svg
                className="h-6 w-6 text-tan"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-espresso">
              Baked Fresh Daily
            </h3>
            <p className="mt-2 text-sm text-hazelnut">
              Every batch is baked fresh — only after you place your order.
              Homemade, by hand, from scratch.
            </p>
          </div>

          <div className="rounded-2xl bg-cream p-6 shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-tan/20">
              <svg
                className="h-6 w-6 text-tan"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-espresso">
              Homemade Taste
            </h3>
            <p className="mt-2 text-sm text-hazelnut">
              Not factory-made. Each cookie is hand-scooped, hand-placed, and
              baked with care.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
