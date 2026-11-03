import { useState } from "react"
import { motion } from "motion/react"
import { ArrowLeft, ArrowRight, ClipboardCheck, Crosshair, Layers, RotateCcw, Target } from "lucide-react"
import Radar from "@/components/rb/Radar"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { BlurFade } from "@/components/magicui/blur-fade"
import { AREAS, ASSESS, SCENARIOS, modeLabel, type Run } from "@/engine"
import { cn } from "@/lib/utils"

type ModeKey = "full" | "challenge" | "area" | "assess"

export function ClockIn({ saved, onStart, onResume, onBack }: {
  saved: Run | null
  onStart: (name: string, mode: string) => void
  onResume: () => void
  onBack: () => void
}) {
  const [name, setName] = useState(saved?.name ?? "")
  const [mode, setMode] = useState<ModeKey>("full")
  const [area, setArea] = useState("email")
  const [phase, setPhase] = useState<"pre" | "post">("pre")
  const [nameError, setNameError] = useState(false)
  const resumable = saved && saved.idx < saved.queue.length

  const MODES: { key: ModeKey; icon: typeof Layers; title: string; meta: string; desc: string }[] = [
    { key: "full", icon: Layers, title: "Full week", meta: `${SCENARIOS.length} situations · ~70 min`, desc: "Monday through Friday with full feedback. Stop anytime and resume later on this device." },
    { key: "challenge", icon: Crosshair, title: "Challenge week", meta: `${SCENARIOS.filter((s) => s.level >= 2).length} situations · Levels 2–3`, desc: "Only the harder situations, for students who’ve finished the full week." },
    { key: "area", icon: Target, title: "Practice one area", meta: "5–8 situations", desc: "Drill a single threat vector, like the focus area from your report card." },
    { key: "assess", icon: ClipboardCheck, title: "Assessment", meta: `${ASSESS.length} situations · ~20 min`, desc: "No answers until the end. Take it as a pre-test before training and a post-test after." },
  ]

  const start = () => {
    const n = name.trim()
    if (!n) { setNameError(true); return }
    const m = mode === "area" ? "area:" + area : mode === "assess" ? "assess:" + phase : mode
    onStart(n, m)
  }

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden pt-28 pb-20">
      <div className="absolute inset-0 -z-20 opacity-60">
        <Radar color="#22b5d6" centerX={0.82} centerY={0.55} scale={1.15} tilt={0.55} targets={5} clutter={0.18} glow={1.1} brightness={0.9} gridOpacity={0.6} speed={0.5} mouseInteraction={false} />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-void via-void/90 to-void/50" />

      <div className="mx-auto grid max-w-6xl gap-10 px-[max(20px,env(safe-area-inset-left))] lg:grid-cols-[0.9fr_1.1fr]">
        <BlurFade>
          <button onClick={onBack} className="mb-8 flex items-center gap-2 text-sm text-mute transition hover:text-ink"><ArrowLeft className="size-4" /> Back</button>
          <div className="eyebrow mb-4">Clock in</div>
          <h1 className="text-[clamp(38px,5.5vw,64px)] leading-[1] font-semibold">Your shift at Halcyon Freight starts now.</h1>
          <p className="mt-5 max-w-md text-lg text-mute">You’re the new dispatch coordinator. Treat every message, call and stranger at the door as if it’s really happening to you.</p>
          <div className="mt-8 grid max-w-md gap-3 text-[14px] text-mute">
            {[["Spot", "Attack or legitimate?"], ["Analyze", "Which details are real evidence?"], ["Respond", "What do you actually do?"]].map(([a, b], i) => (
              <div key={a} className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded-lg bg-defense/10 font-mono text-[12px] text-defense-hi ring-1 ring-defense/25">{i + 1}</span><span><span className="text-ink">{a}.</span> {b}</span></div>
            ))}
          </div>
        </BlurFade>

        <BlurFade delay={0.15} className="rounded-3xl p-6 glass sm:p-8">
          {resumable && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-threat/25 bg-threat/[0.08] px-4 py-3 text-sm">
              <span>Unfinished shift for <span className="font-semibold">{saved.name}</span> · {modeLabel(saved.mode)} · {saved.idx + 1} of {saved.queue.length}</span>
              <button onClick={onResume} className="flex items-center gap-1.5 rounded-lg bg-threat px-3 py-1.5 font-semibold text-void"><RotateCcw className="size-3.5" /> Resume</button>
            </div>
          )}

          <label htmlFor="nm" className="text-sm font-medium">Your name <span className="text-faint">(as your instructor knows you)</span></label>
          <input id="nm" value={name} maxLength={60} autoComplete="name" placeholder="First and last name"
            onChange={(e) => { setName(e.target.value); setNameError(false) }}
            className={cn("mt-2 w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-[15px] outline-none transition placeholder:text-faint focus:border-defense/70",
              nameError ? "border-danger/70" : "border-white/10")} />
          {nameError && <p className="mt-1.5 text-[13px] text-danger">Enter your name so your instructor can match your results.</p>}

          <div className="mt-6 grid gap-2.5" role="radiogroup" aria-label="Mode">
            {MODES.map((m) => {
              const on = mode === m.key
              return (
                <button key={m.key} role="radio" aria-checked={on} onClick={() => setMode(m.key)}
                  className={cn("relative overflow-hidden rounded-2xl border p-4 text-left transition", on ? "border-defense/60" : "border-white/[0.08] hover:border-white/20")}>
                  {on && <motion.span layoutId="mode-bg" className="absolute inset-0 -z-10 bg-defense/[0.08]" transition={{ type: "spring", stiffness: 400, damping: 36 }} />}
                  <div className="flex items-start gap-3">
                    <m.icon className={cn("mt-0.5 size-5 shrink-0", on ? "text-defense-hi" : "text-mute")} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3"><span className="font-semibold">{m.title}</span><span className="font-mono text-[11px] text-faint">{m.meta}</span></div>
                      <p className="mt-1 text-[13.5px] text-mute">{m.desc}</p>
                      {on && m.key === "area" && (
                        <div className="mt-3 flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {Object.entries(AREAS).map(([k, a]) => (
                            <span key={k} role="button" tabIndex={0} onClick={() => setArea(k)} onKeyDown={(e) => e.key === "Enter" && setArea(k)}
                              className={cn("cursor-pointer rounded-full px-3 py-1 text-[12.5px] ring-1 transition", area === k ? "bg-defense text-void ring-defense" : "ring-white/15 hover:ring-white/30")}>
                              {a.short} · {SCENARIOS.filter((s) => s.area === k).length}
                            </span>
                          ))}
                        </div>
                      )}
                      {on && m.key === "assess" && (
                        <div className="mt-3 flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {(["pre", "post"] as const).map((p) => (
                            <span key={p} role="button" tabIndex={0} onClick={() => setPhase(p)} onKeyDown={(e) => e.key === "Enter" && setPhase(p)}
                              className={cn("cursor-pointer rounded-full px-3 py-1 text-[12.5px] ring-1 transition", phase === p ? "bg-defense text-void ring-defense" : "ring-white/15 hover:ring-white/30")}>
                              {p === "pre" ? "Pre-test" : "Post-test"}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <ShimmerButton onClick={start} background="linear-gradient(135deg,#0891b2,#0b5f78)" shimmerColor="#a5f3fc" borderRadius="14px" className="mt-6 w-full py-3.5 text-[15px] font-semibold">
            <span className="flex items-center gap-2">Clock in <ArrowRight className="size-4" /></span>
          </ShimmerButton>
          <p className="mt-4 text-center text-[12px] text-faint">All companies, people and brands in this simulation are fictional.</p>
        </BlurFade>
      </div>
    </section>
  )
}
