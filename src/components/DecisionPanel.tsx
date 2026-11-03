import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowRight, Check, CircleSlash, X } from "lucide-react"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { scoreOf, type Answer, type Scenario } from "@/engine"
import { cn } from "@/lib/utils"

const slide = {
  initial: { opacity: 0, x: 24, filter: "blur(4px)" },
  animate: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: { opacity: 0, x: -24, filter: "blur(4px)" },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div>
      <div className="mb-1.5 flex justify-between font-mono text-[11px] tracking-wider text-mute uppercase"><span>{label}</span><span className="text-ink">{value}/{max}</span></div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
        <motion.div className={cn("h-full rounded-full", pct >= 80 ? "bg-safe" : pct >= 50 ? "bg-threat" : "bg-danger")}
          initial={{ width: 0 }} animate={{ width: pct + "%" }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
      </div>
    </div>
  )
}

/**
 * Spot → Analyze → Respond → Debrief for one situation.
 * With feedback off (assessments) it reports the answer and moves on without showing results.
 */
export function DecisionPanel({ s, feedback = true, onAnswered, onNext, nextLabel = "Next situation", initial }: {
  s: Scenario
  feedback?: boolean
  onAnswered?: (a: Answer) => void
  onNext?: () => void
  nextLabel?: string
  initial?: Answer
}) {
  const [step, setStep] = useState(initial ? 3 : 0)
  const [verdict, setVerdict] = useState<boolean | null>(initial?.verdict ?? null)
  const [ev, setEv] = useState<number[]>(initial?.evidence ?? [])
  const [resp, setResp] = useState<number | null>(initial?.response ?? null)
  const score = step === 3 && verdict !== null && resp !== null ? scoreOf(s, verdict, ev, resp) : null
  const best = s.responses.reduce((m, r) => (r.p > m.p ? r : m), s.responses[0])

  const finish = (r: number) => {
    setResp(r)
    const a: Answer = { verdict: verdict!, evidence: ev, response: r, score: scoreOf(s, verdict!, ev, r) }
    onAnswered?.(a)
    if (feedback) setStep(3)
    else onNext?.()
  }

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6 grid grid-cols-3 gap-2">
        {["Spot", "Analyze", "Respond"].map((t, i) => (
          <div key={t}>
            <div className="h-[3px] overflow-hidden rounded-full bg-white/[0.08]">
              <motion.div className="h-full bg-defense" animate={{ width: step > i ? "100%" : step === i ? "45%" : "0%" }} transition={{ duration: 0.5 }} />
            </div>
            <div className={cn("mt-2 font-mono text-[11px] tracking-wider uppercase", step >= i ? "text-ink" : "text-faint")}>{i + 1} {t}</div>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="v" {...slide}>
            <h3 className="text-2xl font-semibold">What’s your read?</h3>
            <p className="mt-1 text-sm text-mute">Look closely at the situation before you decide.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {([[false, "Legitimate", "Normal, safe activity", "hover:border-safe/60"], [true, "Attack", "Something is wrong", "hover:border-threat/70"]] as const).map(([val, t, d, h]) => (
                <motion.button key={t} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setVerdict(val); setStep(1) }}
                  className={cn("rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition", h)}>
                  <div className="font-display text-xl font-semibold">{t}</div>
                  <div className="mt-1 text-[13px] text-mute">{d}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="e" {...slide}>
            <h3 className="text-2xl font-semibold">Which details are real evidence?</h3>
            <p className="mt-1 text-sm text-mute">You called it <span className="text-ink">{verdict ? "an attack" : "legitimate"}</span>. Select every detail that genuinely supports the right call. Some only look important.</p>
            <div className="mt-5 grid gap-2">
              {s.evidence.map((e, i) => {
                const on = ev.includes(i)
                return (
                  <motion.button key={i} whileTap={{ scale: 0.99 }} aria-pressed={on}
                    onClick={() => setEv((x) => (on ? x.filter((y) => y !== i) : [...x, i]))}
                    className={cn("flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-[14px] transition",
                      on ? "border-defense/60 bg-defense/[0.09]" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20")}>
                    <span className={cn("mt-0.5 grid size-4 shrink-0 place-items-center rounded-[5px] border", on ? "border-defense bg-defense text-void" : "border-white/25")}>{on && <Check className="size-3" strokeWidth={3} />}</span>
                    {e.t}
                  </motion.button>
                )
              })}
            </div>
            <button onClick={() => setStep(2)} className="mt-5 rounded-xl bg-defense px-5 py-2.5 text-sm font-semibold text-void transition hover:bg-defense-hi">Lock in evidence</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="r" {...slide}>
            <h3 className="text-2xl font-semibold">What do you do?</h3>
            <p className="mt-1 text-sm text-mute">Pick the action you’d actually take.</p>
            <div className="mt-5 grid gap-2">
              {s.responses.map((r, i) => (
                <motion.button key={i} whileTap={{ scale: 0.99 }} onClick={() => finish(i)}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-left text-[14px] transition hover:border-defense/50 hover:bg-defense/[0.06]">
                  {r.t}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && score && resp !== null && (
          <motion.div key="d" {...slide} className="flex flex-col">
            <div className="flex items-end gap-4">
              <div className={cn("font-display text-6xl font-semibold tabular-nums", score.total >= 80 ? "text-safe" : score.total >= 50 ? "text-threat-hi" : "text-danger")}>
                <NumberTicker value={score.total} className="text-inherit" />
              </div>
              <div className="min-w-0 pb-2">
                <span className={cn("rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider", s.attack ? "bg-threat/15 text-threat-hi" : "bg-safe/15 text-safe")}>{s.attack ? "ATTACK" : "LEGITIMATE"}</span>
                <div className="mt-1 font-display text-lg leading-tight font-semibold">{s.debrief.name}</div>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <Bar label="Spot" value={score.spot} max={30} />
              <Bar label="Analyze" value={score.analyze} max={30} />
              <Bar label="Respond" value={score.respond} max={40} />
            </div>
            {verdict !== s.attack && <p className="mt-3 text-[13.5px] text-mute">You called it {verdict ? "an attack" : "legitimate"}, but it was {s.attack ? "an attack" : "legitimate"}.</p>}

            <div className={cn("mt-5 rounded-xl px-4 py-3 text-[14px] ring-1",
              s.responses[resp].p >= 40 ? "bg-safe/10 ring-safe/25" : s.responses[resp].p >= 15 ? "bg-threat/10 ring-threat/25" : "bg-danger/10 ring-danger/25")}>
              <div className="font-medium">{s.responses[resp].t}</div>
              <div className="mt-1 text-mute">{s.responses[resp].out}</div>
            </div>
            {s.responses[resp].p < best.p && <p className="mt-3 text-[13.5px] text-mute">Best response: <span className="text-ink">{best.t}</span></p>}

            <details className="group mt-5 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
              <summary className="cursor-pointer list-none font-mono text-[11px] tracking-wider text-mute uppercase marker:hidden">
                Evidence breakdown <span className="text-faint group-open:hidden">· show</span>
              </summary>
              <div className="mt-3 grid gap-3">
                {s.evidence.map((e, i) => {
                  const picked = ev.includes(i)
                  const Icon = e.k ? (picked ? Check : CircleSlash) : picked ? X : Check
                  const tone = e.k ? (picked ? "text-safe" : "text-threat-hi") : picked ? "text-danger" : "text-faint"
                  const note = e.k ? (picked ? "Real evidence, and you caught it." : "Real evidence you missed.") : picked ? "Not real evidence." : "Correctly ignored."
                  return (
                    <div key={i} className="grid grid-cols-[18px_1fr] gap-2 text-[13.5px]">
                      <Icon className={cn("mt-0.5 size-4", tone)} />
                      <div><span className="text-ink">{e.t}</span> <span className="text-faint">· {note}</span><div className="text-mute">{e.why}</div></div>
                    </div>
                  )
                })}
              </div>
            </details>

            <p className="mt-5 text-[15px] leading-relaxed text-ink">{s.debrief.lesson}</p>
            <div className="mt-4 grid gap-4 text-[13.5px] sm:grid-cols-2">
              <div><div className="font-mono text-[10.5px] tracking-wider text-safe uppercase">Do</div><ul className="mt-1.5 grid gap-1 text-mute">{s.debrief.dos.map((d) => <li key={d}>· {d}</li>)}</ul></div>
              <div><div className="font-mono text-[10.5px] tracking-wider text-danger uppercase">Don’t</div><ul className="mt-1.5 grid gap-1 text-mute">{s.debrief.donts.map((d) => <li key={d}>· {d}</li>)}</ul></div>
            </div>

            {onNext && (
              <button onClick={onNext} className="mt-6 flex items-center justify-center gap-2 self-start rounded-xl bg-defense px-5 py-3 text-sm font-semibold text-void transition hover:bg-defense-hi">
                {nextLabel} <ArrowRight className="size-4" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
