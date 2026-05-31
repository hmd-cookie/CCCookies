"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"

export default function CookieScene() {
  const ref = useRef<HTMLDivElement>(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / rect.width
      const dy = (e.clientY - cy) / rect.height
      setRotate({ x: -dy * 12, y: dx * 12 })
    }

    el.addEventListener("mousemove", handleMouseMove)
    return () => el.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div ref={ref} className="flex h-full w-full items-center justify-center">
      <div
        className="relative h-72 w-72 sm:h-80 sm:w-80 lg:h-96 lg:w-96 transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: `perspective(800px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        <div className="absolute inset-0 animate-float">
          <Image
            src="/images/cookie.png"
            alt="Freshly baked chocolate chip cookie"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
        <div className="absolute -bottom-4 left-1/2 h-4 w-3/4 -translate-x-1/2 rounded-full bg-espresso/10 blur-xl animate-pulse-slow" />
      </div>
    </div>
  )
}
