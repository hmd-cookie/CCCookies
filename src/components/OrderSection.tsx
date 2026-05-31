"use client"

import { PRODUCT } from "@/lib/constants"
import { useCart } from "@/store/cart"

export default function OrderSection() {
  const { addItem, openCart } = useCart()

  const handleAdd = () => {
    addItem({
      id: PRODUCT.id,
      name: PRODUCT.name,
      price: PRODUCT.price,
      quantity: 1,
    })
    openCart()
  }

  return (
    <section
      id="order"
      className="border-t border-beige px-6 py-24"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-espresso sm:text-4xl">
          Ready to Order?
        </h2>
        <p className="mt-4 text-lg text-hazelnut">
          One size. One perfect cookie. All you need to decide is how many.
        </p>

        <div className="mx-auto mt-12 max-w-sm rounded-2xl border border-beige bg-cream p-8 shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-tan/10">
            <svg
              className="h-10 w-10 text-tan"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
              />
            </svg>
          </div>

          <h3 className="mt-6 text-xl font-semibold text-espresso">
            {PRODUCT.name}
          </h3>
          <p className="mt-2 text-sm text-hazelnut">{PRODUCT.description}</p>

          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-hazelnut">
            <span>{PRODUCT.weight}</span>
            <span className="text-beige">|</span>
            <span>{PRODUCT.ingredients.length} ingredients</span>
          </div>

          <p className="mt-6 text-3xl font-bold text-espresso">
            ${PRODUCT.price.toFixed(2)}
          </p>

          <button
            onClick={handleAdd}
            className="mt-6 w-full rounded-full bg-tan px-8 py-3 text-base font-semibold text-espresso transition-colors hover:bg-caramel"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  )
}
