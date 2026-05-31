export const SITE_NAME = "CCCookies"
export const SITE_TAGLINE = "Homemade chocolate chip cookies, baked with love"

export const PRODUCT = {
  id: "ccc-original",
  name: "Classic Chocolate Chip Cookie",
  description:
    "Our signature homemade chocolate chip cookie. Baked golden brown with premium dark chocolate chunks and a hint of vanilla. Crispy on the edges, chewy in the center.",
  price: 4.99,
  currency: "USD",
  weight: "120g",
  ingredients: [
    "Premium dark chocolate chunks",
    "Unsalted butter",
    "Brown sugar",
    "Free-range eggs",
    "Vanilla extract",
    "Organic all-purpose flour",
    "Baking soda",
    "Sea salt",
  ],
}

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Order", href: "#order" },
  { label: "Contact", href: "#contact" },
] as const
