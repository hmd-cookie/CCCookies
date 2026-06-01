export const SITE_NAME = "CCCookies"
export const SITE_TAGLINE = "Eggless chocolate chip cookies, baked fresh on order"

export type Pack = {
  id: string
  name: string
  cookie_count: number
  price: number
  description: string
  popular: boolean
  savings: string | null
}

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Order", href: "#order" },
  { label: "Contact", href: "#contact" },
] as const
