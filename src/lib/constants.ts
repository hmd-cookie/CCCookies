export const SITE_NAME = "CCCookies"
export const SITE_TAGLINE = "Eggless chocolate chip cookies, baked fresh on order"

export type Pack = {
  id: string
  name: string
  cookieCount: number
  price: number
  perCookie: number
  description: string
  popular: boolean
  savings: string | null
}

export const PACKS: Pack[] = [
  {
    id: "pack-6",
    name: "6-Pack",
    cookieCount: 6,
    price: 14.99,
    perCookie: 2.50,
    description:
      "Perfect for a taste. A half-dozen of our classic eggless dark chocolate chip cookies.",
    popular: false,
    savings: null,
  },
  {
    id: "pack-12",
    name: "12-Pack",
    cookieCount: 12,
    price: 27.99,
    perCookie: 2.33,
    description:
      "Our most popular size. Great for sharing with family or stocking up.",
    popular: true,
    savings: "Save $1.99",
  },
  {
    id: "pack-20",
    name: "20-Pack",
    cookieCount: 20,
    price: 39.99,
    perCookie: 2.00,
    description:
      "Best value — perfect for parties, events, or serious cookie lovers.",
    popular: false,
    savings: "Save $7.99",
  },
]

export const PRODUCT = {
  id: "ccc-original",
  name: "Classic Dark Chocolate Chip Cookie",
  description:
    "Eggless, vegetarian, and vegan-friendly. Each batch is baked fresh — only after you place your order. We use rich dark chocolate (70% cocoa) for that deep, indulgent taste. No eggs. No compromises. Just a perfectly chewy, homemade cookie crafted from scratch.",
  price: 4.99,
  currency: "USD",
  weight: "120g",
  ingredients: [
    "Dark chocolate chunks (70% cocoa)",
    "All-purpose flour",
    "Salted butter",
    "Condensed milk",
    "Brown sugar",
    "Baking essentials",
  ],
}

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Order", href: "#order" },
  { label: "Contact", href: "#contact" },
] as const
