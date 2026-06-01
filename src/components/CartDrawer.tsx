"use client"

import { useCart } from "@/store/cart"

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, hydrated } =
    useCart()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-espresso/30 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-beige px-6 py-4">
          <h2 className="text-lg font-semibold text-espresso">Your Cart</h2>
          <button
            onClick={closeCart}
            className="rounded-full p-1 text-hazelnut transition-colors hover:text-espresso"
            aria-label="Close cart"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!hydrated ? null : items.length === 0 ? (
            <div className="mt-20 text-center">
              <p className="text-hazelnut">Your cart is empty</p>
              <p className="mt-1 text-sm text-hazelnut/70">
                Add a cookie to get started!
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 rounded-lg bg-beige/50 p-3"
                >
                  <div className="flex-1">
                    <p className="font-medium text-espresso">{item.name}</p>
                    <p className="text-sm text-hazelnut">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-tan text-hazelnut transition-colors hover:bg-tan hover:text-espresso"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-medium text-espresso">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-tan text-hazelnut transition-colors hover:bg-tan hover:text-espresso"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-hazelnut/50 transition-colors hover:text-red-500"
                    aria-label="Remove item"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {hydrated && items.length > 0 && (
          <div className="border-t border-beige px-6 py-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold text-espresso">Total</span>
              <span className="text-lg font-bold text-espresso">
                ${totalPrice().toFixed(2)}
              </span>
            </div>
            <a
              href="/checkout"
              onClick={closeCart}
              className="block w-full rounded-full bg-tan px-6 py-3 text-center font-medium text-espresso transition-colors hover:bg-caramel"
            >
              Proceed to Checkout
            </a>
          </div>
        )}
      </div>
    </>
  )
}
