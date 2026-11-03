import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/** Muted looping video that only plays while on screen, and falls back to its poster under reduced motion. */
export function LazyVideo({ src, poster, className, eager = false }: { src: string; poster?: string; className?: string; eager?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.2 }
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      className={cn("transition-opacity duration-700", ready ? "opacity-100" : "opacity-0", className)}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload={eager ? "auto" : "metadata"}
      autoPlay={eager}
      onLoadedData={() => setReady(true)}
      aria-hidden="true"
    />
  )
}
