import { AnimatePresence, motion } from "motion/react"
import { LogOut } from "lucide-react"
import { SituationView } from "@/components/SituationView"
import { DecisionPanel } from "@/components/DecisionPanel"
import { BorderBeam } from "@/components/magicui/border-beam"
import { AREAS, DAYS, byId, isAssess, modeLabel, type Answer, type Run } from "@/engine"
import { cn } from "@/lib/utils"

function ShiftStrip({ run }: { run: Run }) {
  const cur = byId[run.queue[Math.min(run.idx, run.queue.length - 1)]]
  const assess = isAssess(run.mode)
  return (
    <div className="grid grid-cols-5 gap-2">
      {DAYS.map((d, di) => {
        const ids = run.queue.filter((id) => byId[id].day === di)
        return (
          <div key={d}>
            <div className={cn("font-mono text-[10.5px] tracking-[0.14em] uppercase", cur.day === di ? "text-ink" : "text-faint")}>{d.slice(0, 3)}</div>
            <div className="mt-1.5 flex gap-[3px]">
              {ids.length === 0 && <i className="h-1.5 flex-1 rounded-full bg-white/[0.04]" />}
              {ids.map((id) => {
                const a = run.answers[id]
                const now = id === run.queue[run.idx]
                return (
                  <i key={id} className={cn("relative h-1.5 flex-1 overflow-hidden rounded-full",
                    a ? (assess || a.score.total >= 70 ? "bg-defense" : "bg-threat") : now ? "bg-ink" : "bg-white/[0.08]")}>
                    {now && !a && <motion.span className="absolute inset-0 bg-defense-hi" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.6, repeat: Infinity }} />}
                  </i>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function Play({ run, onAnswer, onNext, onExit }: {
  run: Run
  onAnswer: (id: string, a: Answer) => void
  onNext: () => void
  onExit: () => void
}) {
  const s = byId[run.queue[run.idx]]
  const assess = isAssess(run.mode)
  const last = run.idx + 1 >= run.queue.length

  return (
    <section className="mx-auto max-w-6xl px-[max(20px,env(safe-area-inset-left))] pt-28 pb-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="eyebrow">{modeLabel(run.mode)}</div>
          <div className="mt-1 text-sm text-mute">{run.name}</div>
        </div>
        <button onClick={onExit} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-mute ring-1 ring-white/10 transition hover:text-ink">
          <LogOut className="size-4" /> Save & exit
        </button>
      </div>
      <ShiftStrip run={run} />

      <AnimatePresence mode="wait">
        <motion.div key={s.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
          <div className="mt-7 mb-3 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[14px] font-medium">{DAYS[s.day].toUpperCase()} · {s.time}</span>
            <span className="rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[10.5px] tracking-wider text-mute uppercase">{AREAS[s.area].short}</span>
            <span className="ml-auto font-mono text-[12px] text-faint">{run.idx + 1} / {run.queue.length}</span>
          </div>
          <div className="grid items-start gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative overflow-hidden rounded-3xl glass">
              <BorderBeam size={150} duration={11} colorFrom="#22b5d6" colorTo="#0891b2" />
              <SituationView s={s} levelTag={<span className="rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-mute">LEVEL {s.level}</span>} />
            </div>
            <div className="relative overflow-hidden rounded-3xl glass lg:sticky lg:top-24">
              <DecisionPanel key={s.id} s={s} feedback={!assess} initial={run.answers[s.id]}
                onAnswered={(a) => onAnswer(s.id, a)} onNext={onNext}
                nextLabel={last ? "See my report card" : "Next situation"} />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
