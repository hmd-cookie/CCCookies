export const SITE_NAME = "CCCookies"
export const SITE_TAGLINE = "Eggless chocolate chip cookies, baked fresh on order"

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
