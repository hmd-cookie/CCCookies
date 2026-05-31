import { SITE_NAME } from "@/lib/constants"

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="border-t border-beige bg-beige/30 px-6 py-24"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-espresso sm:text-4xl">
          Get in Touch
        </h2>
        <p className="mt-4 text-lg text-hazelnut">
          Questions, custom orders, or just want to say hello? We&apos;d love to
          hear from you.
        </p>

        <div className="mx-auto mt-12 max-w-md space-y-4">
          <a
            href="mailto:hmd.cookie@protonmail.com"
            className="flex items-center justify-center gap-3 rounded-full border border-tan bg-cream px-6 py-3 text-hazelnut transition-colors hover:bg-tan hover:text-espresso"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
            hmd.cookie@protonmail.com
          </a>
        </div>

        <p className="mt-8 text-xs text-hazelnut/50">
          {SITE_NAME} — Baked fresh, shipped with care.
        </p>
      </div>
    </section>
  )
}
