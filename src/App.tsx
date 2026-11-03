import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, useInView } from "motion/react"
import { useRef } from "react"
import {
  ArrowRight, Award, Bot, Check, DoorOpen, Laptop, Lock, Mail, Phone, Play, ShieldCheck, Smartphone, Wifi,
} from "lucide-react"
import Radar from "@/components/rb/Radar"
import DecryptedText from "@/components/rb/DecryptedText"
import { BorderBeam } from "@/components/magicui/border-beam"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { MagicCard } from "@/components/magicui/magic-card"
import { ShineBorder } from "@/components/magicui/shine-border"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Globe } from "@/components/magicui/globe"
import { SAMPLES, scoreOf, type Scenario } from "@/data"
import { cn } from "@/lib/utils"
import type { COBEOptions } from "cobe"

/* ───────────────────────── NAV ───────────────────────── */
function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
      <div className="mx-auto mt-3 flex max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 py-2.5 glass mx-[max(12px,env(safe-area-inset-left))] md:mx-auto">
        <a href="#top" className="flex items-center gap-3">
          <img src="/logo.png" alt="Launching IT Solutions" className="size-9 object-contain" />
          <div className="leading-tight">
            <div className="font-mono text-[10px] tracking-[0.2em] text-mute uppercase">Launching IT Solutions</div>
            <div className="font-display text-[17px] font-semibold">Threat Week</div>
          </div>
        </a>
        <nav className="hidden items-center gap-7 text-sm text-mute md:flex">
          <a className="transition hover:text-ink" href="#vectors">Threat vectors</a>
          <a className="transition hover:text-ink" href="#live">Live situation</a>
          <a className="transition hover:text-ink" href="#map">Threat picture</a>
          <a className="transition hover:text-ink" href="#report">Report card</a>
        </nav>
        <a href="#live" className="rounded-xl bg-white/[0.06] px-4 py-2 text-sm font-medium ring-1 ring-white/10 transition hover:bg-white/[0.1]">
          Start shift
        </a>
      </div>
    </header>
  )
}

/* ───────────────────────── HERO ───────────────────────── */
const FEED = [
  { tag: "BLOCKED", kind: "Look-alike domain", detail: "halcyon-freight-it.com", tone: "threat" },
  { tag: "FLAGGED", kind: "Voice clone", detail: "“Priya Shah” · unknown number", tone: "threat" },
  { tag: "VERIFIED", kind: "VPN reconnect", detail: "Halcyon Secure Connect", tone: "safe" },
  { tag: "QUARANTINED", kind: "Double extension", detail: "Invoice_44871.pdf.html", tone: "threat" },
  { tag: "DENIED", kind: "MFA push bombing", detail: "6 prompts · Bucharest, RO", tone: "threat" },
  { tag: "STOPPED", kind: "Tailgating attempt", detail: "Side entrance · 8:45 AM", tone: "threat" },
]

function ThreatFeed() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % FEED.length), 2600)
    return () => clearInterval(t)
  }, [])
  const visible = [0, 1, 2].map((k) => FEED[(i + k) % FEED.length])
  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl p-4 glass">
      <BorderBeam size={120} duration={9} colorFrom="#22b5d6" colorTo="#f59e0b" />
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.18em] text-mute uppercase">Intercept log</span>
        <span className="flex items-center gap-2 font-mono text-[11px] text-safe">
          <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping-slow rounded-full bg-safe/70" /><span className="relative inline-flex size-2 rounded-full bg-safe" /></span>
          LIVE
        </span>
      </div>
      <ul className="relative h-[196px]">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((f, k) => (
            <motion.li
              key={f.kind}
              layout
              initial={{ opacity: 0, y: -18, filter: "blur(6px)" }}
              animate={{ opacity: 1 - k * 0.28, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="mb-2 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5"
            >
              <span className={cn("rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider",
                f.tone === "safe" ? "bg-safe/15 text-safe" : "bg-threat/15 text-threat-hi")}>{f.tag}</span>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-medium">{f.kind}</div>
                <div className="truncate font-mono text-[11px] text-mute">{f.detail}</div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}

function Hero() {
  return (
    <section id="top" className="grain relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16">
      <div className="absolute inset-0 -z-20">
        <Radar color="#22b5d6" centerX={0.7} centerY={0.52} scale={1.08} tilt={0.5} targets={7} clutter={0.22}
          glow={1.3} brightness={1.15} gridOpacity={0.75} speed={0.7} trail={0.45} ringCount={7} spokeCount={12} />
      </div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_50%,transparent_0%,rgba(4,6,13,0.35)_45%,rgba(4,6,13,0.92)_80%)]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-void via-void/80 to-transparent md:via-void/55" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-void to-transparent" />

      <div className="mx-auto grid w-full max-w-6xl items-end gap-12 px-[max(20px,env(safe-area-inset-left))] md:grid-cols-[1.25fr_0.75fr]">
        <div>
          <BlurFade delay={0.1}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-defense/25 bg-defense/[0.07] px-3 py-1.5">
              <ShieldCheck className="size-3.5 text-defense-hi" />
              <span className="eyebrow">Live-fire cybersecurity simulation</span>
            </div>
          </BlurFade>
          <h1 className="text-[clamp(44px,8vw,96px)] leading-[0.95] font-semibold">
            <BlurFade delay={0.2}><span className="block">Defend</span></BlurFade>
            <span className="block bg-gradient-to-r from-ink via-defense-hi to-defense bg-clip-text text-transparent">
              <DecryptedText text="the week." animateOn="view" sequential speed={55} revealDirection="start"
                characters="ABCDEF0123456789#$%&*<>/" className="" encryptedClassName="text-defense/60" />
            </span>
          </h1>
          <BlurFade delay={0.45}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">
              You’re the new hire at Halcyon Freight. Over five workdays, <span className="text-ink">37 real-world attacks</span> hit
              your inbox, your phone, the front door and public Wi-Fi, mixed in with ordinary work. Spot them. Analyze them. Respond.
            </p>
          </BlurFade>
          <BlurFade delay={0.6}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <ShimmerButton background="linear-gradient(135deg,#0891b2,#0b5f78)" shimmerColor="#a5f3fc" borderRadius="14px" className="px-6 py-3.5 text-[15px] font-semibold">
                <span className="flex items-center gap-2">Start your shift <ArrowRight className="size-4" /></span>
              </ShimmerButton>
              <a href="#live" className="group flex items-center gap-2.5 rounded-[14px] px-5 py-3.5 text-[15px] text-ink ring-1 ring-white/15 transition hover:bg-white/[0.05]">
                <Play className="size-4 text-defense-hi" /> Try a situation
              </a>
            </div>
          </BlurFade>
          <BlurFade delay={0.75}>
            <dl className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-6">
              {[
                [37, "situations", "Mon → Fri"],
                [6, "threat vectors", "email to AI"],
                [3, "skill scores", "spot · analyze · respond"],
              ].map(([n, l, s]) => (
                <div key={l as string}>
                  <dt className="font-display text-4xl font-semibold tabular-nums"><NumberTicker value={n as number} className="text-ink" /></dt>
                  <dd className="mt-1 text-sm text-ink/90">{l}</dd>
                  <dd className="font-mono text-[11px] text-faint">{s}</dd>
                </div>
              ))}
            </dl>
          </BlurFade>
        </div>
        <BlurFade delay={0.9} className="hidden justify-self-end md:block">
          <ThreatFeed />
        </BlurFade>
      </div>
    </section>
  )
}

/* ───────────────────────── MARQUEE ───────────────────────── */
function Ticker() {
  const items = ["Phishing", "Business email compromise", "Smishing", "Vishing", "Deepfake video", "Voice cloning", "Prompt injection", "Evil-twin Wi-Fi", "Man-in-the-middle", "Tailgating", "USB drops", "Ransomware", "MFA fatigue", "SIM swapping", "Quishing"]
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] bg-deep py-4 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <motion.div className="flex w-max gap-10 whitespace-nowrap font-mono text-[12px] tracking-[0.16em] text-mute uppercase"
        animate={{ x: ["0%", "-50%"] }} transition={{ duration: 40, ease: "linear", repeat: Infinity }}>
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-10">{t}<span className="text-threat">◆</span></span>
        ))}
      </motion.div>
    </div>
  )
}

/* ───────────────────────── VECTORS ───────────────────────── */
const VECTORS = [
  { icon: Mail, name: "Email", n: 7, ex: "Phishing, CEO wire fraud, poisoned attachments" },
  { icon: Smartphone, name: "Phone, text & social", n: 8, ex: "Smishing, vishing, QR codes, SIM swaps, romance scams" },
  { icon: Bot, name: "AI & deepfakes", n: 6, ex: "Cloned voices, deepfake calls, fake chatbots, prompt injection", featured: true },
  { icon: Wifi, name: "Network & Wi-Fi", n: 5, ex: "Evil twins, man-in-the-middle, rogue certificates" },
  { icon: DoorOpen, name: "Physical", n: 5, ex: "Tailgating, fake contractors, USB drops, shoulder surfing" },
  { icon: Laptop, name: "Devices & accounts", n: 6, ex: "Fake updates, scareware, MFA fatigue, ransomware" },
]

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <BlurFade inView className="mb-12 max-w-2xl">
      <div className="eyebrow mb-4">{eyebrow}</div>
      <h2 className="text-[clamp(32px,4.6vw,52px)] leading-[1.05] font-semibold">{title}</h2>
      {sub && <p className="mt-4 text-lg text-mute">{sub}</p>}
    </BlurFade>
  )
}

function Vectors() {
  return (
    <section id="vectors" className="mx-auto max-w-6xl px-[max(20px,env(safe-area-inset-left))] py-28">
      <SectionHead eyebrow="Six threat vectors" title="Attacks don’t come from one direction." sub="Every situation is scored by vector, so each student sees exactly where they’re exposed." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {VECTORS.map((v, i) => (
          <BlurFade key={v.name} inView delay={0.06 * i}>
            <MagicCard className="h-full rounded-2xl" gradientFrom="#22b5d6" gradientTo="#0891b2" gradientColor="#0f1a33" gradientOpacity={0.9}>
              <div className="relative flex h-full flex-col gap-5 p-6">
                {v.featured && <BorderBeam size={90} duration={7} colorFrom="#f59e0b" colorTo="#22b5d6" />}
                <div className="flex items-center justify-between">
                  <div className={cn("grid size-11 place-items-center rounded-xl ring-1",
                    v.featured ? "bg-threat/10 text-threat-hi ring-threat/30" : "bg-defense/10 text-defense-hi ring-defense/25")}>
                    <v.icon className="size-5" />
                  </div>
                  <span className="font-mono text-[11px] text-faint">{v.n} situations</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{v.name}{v.featured && <span className="ml-2 rounded-md bg-threat/15 px-1.5 py-0.5 align-middle font-mono text-[10px] text-threat-hi">FASTEST GROWING</span>}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-mute">{v.ex}</p>
                </div>
              </div>
            </MagicCard>
          </BlurFade>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────── LIVE SITUATION ───────────────────────── */
function Device({ s }: { s: Scenario }) {
  const [tip, setTip] = useState(false)
  const v = s.view
  if (v.type === "email") {
    const [a, b] = v.body.split("{link}")
    return (
      <div className="p-6">
        <div className="font-display text-xl font-semibold">{v.subject}</div>
        <div className="mt-4 flex items-center gap-3 border-b border-white/[0.07] pb-4">
          <div className="grid size-10 place-items-center rounded-full bg-defense/15 font-semibold text-defense-hi">IT</div>
          <div className="min-w-0">
            <div className="font-medium">{v.fromName}</div>
            <div className="truncate font-mono text-[12px] text-mute">&lt;{v.fromAddr}&gt;</div>
          </div>
        </div>
        <div className="mt-4 text-[15px] leading-relaxed whitespace-pre-line text-ink/90">
          {a}
          {v.link && (
            <span>
              <button onClick={() => setTip((t) => !t)} className="break-all text-defense-hi underline decoration-defense/50 underline-offset-4">{v.link.text}</button>
              <AnimatePresence>
                {tip && (
                  <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-2 block rounded-lg border border-threat/30 bg-threat/10 px-3 py-2 font-mono text-[12px] break-all text-threat-hi">
                    Real destination → {v.link.href}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          )}
          {b}
        </div>
        <div className="mt-5 font-mono text-[11px] text-faint">Tap the link to inspect where it really goes.</div>
      </div>
    )
  }
  if (v.type === "voicemail") {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center gap-2 border-b border-white/[0.07] pb-6 text-center">
          <div className="relative grid size-16 place-items-center rounded-full bg-defense/10 ring-1 ring-defense/30">
            <span className="absolute inset-0 animate-ping-slow rounded-full ring-1 ring-defense/40" />
            <Phone className="size-6 text-defense-hi" />
          </div>
          <div className="font-display text-xl font-semibold">{v.callerName}</div>
          <div className="font-mono text-[12px] text-mute">{v.callerNum} · voicemail 0:38</div>
          <div className="mt-2 flex h-8 items-end gap-[3px]">
            {Array.from({ length: 42 }).map((_, i) => (
              <motion.span key={i} className="w-[3px] rounded-full bg-defense/70"
                animate={{ height: [6, 8 + ((i * 37) % 22), 6] }} transition={{ duration: 1.1 + (i % 5) * 0.12, repeat: Infinity, ease: "easeInOut" }} />
            ))}
          </div>
        </div>
        <p className="mt-5 border-l-2 border-white/10 pl-4 text-[15px] leading-relaxed text-ink/90">{v.transcript}</p>
        <p className="mt-4 text-[14px] text-mute italic">{v.note}</p>
      </div>
    )
  }
  return (
    <div className="p-6">
      <div className="font-mono text-[12px] tracking-wider text-mute uppercase">{v.place}</div>
      <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08]">
        {v.networks.map((n) => (
          <div key={n.name} className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3 last:border-0">
            <Wifi className="size-4 text-mute" />
            <span className="flex-1 font-medium">{n.name}</span>
            <span className="font-mono text-[11px] text-mute">{n.lock ? <span className="flex items-center gap-1"><Lock className="size-3" /> Secured</span> : "Open"}</span>
            <span className="flex h-3.5 items-end gap-[2px]">{[1, 2, 3, 4].map((b) => <i key={b} className={cn("w-[3px] rounded-sm", b <= n.bars ? "bg-ink" : "bg-white/15")} style={{ height: b * 3 + 2 }} />)}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-threat/10 px-4 py-3 text-[14px] text-threat-hi ring-1 ring-threat/20">{v.note}</div>
    </div>
  )
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

function Decision({ s }: { s: Scenario }) {
  const [step, setStep] = useState(0)
  const [verdict, setVerdict] = useState<boolean | null>(null)
  const [ev, setEv] = useState<number[]>([])
  const [resp, setResp] = useState<number | null>(null)
  const score = useMemo(() => (step === 3 && verdict !== null && resp !== null ? scoreOf(s, verdict, ev, resp) : null), [step, verdict, ev, resp, s])
  const best = s.responses.reduce((m, r) => (r.p > m.p ? r : m), s.responses[0])
  const steps = ["Spot", "Analyze", "Respond"]
  const slide = { initial: { opacity: 0, x: 24, filter: "blur(4px)" }, animate: { opacity: 1, x: 0, filter: "blur(0px)" }, exit: { opacity: 0, x: -24, filter: "blur(4px)" }, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } }

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6 grid grid-cols-3 gap-2">
        {steps.map((t, i) => (
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
            <p className="mt-1 text-sm text-mute">Look closely before you decide.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[[false, "Legitimate", "Normal, safe activity", "hover:border-safe/60"], [true, "Attack", "Something is wrong", "hover:border-threat/70"]].map(([val, t, d, h]) => (
                <motion.button key={t as string} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setVerdict(val as boolean); setStep(1) }}
                  className={cn("rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition", h as string)}>
                  <div className="font-display text-xl font-semibold">{t as string}</div>
                  <div className="mt-1 text-[13px] text-mute">{d as string}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="e" {...slide}>
            <h3 className="text-2xl font-semibold">Which details are real evidence?</h3>
            <p className="mt-1 text-sm text-mute">Select every detail that matters. Some only look important.</p>
            <div className="mt-5 grid gap-2">
              {s.evidence.map((e, i) => {
                const on = ev.includes(i)
                return (
                  <motion.button key={i} layout whileTap={{ scale: 0.99 }} onClick={() => setEv((x) => (on ? x.filter((y) => y !== i) : [...x, i]))}
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
                <motion.button key={i} whileTap={{ scale: 0.99 }} onClick={() => { setResp(i); setStep(3) }}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-left text-[14px] transition hover:border-defense/50 hover:bg-defense/[0.06]">
                  {r.t}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
        {step === 3 && score && resp !== null && (
          <motion.div key="d" {...slide}>
            <div className="flex items-end gap-4">
              <div className={cn("font-display text-6xl font-semibold tabular-nums", score.total >= 80 ? "text-safe" : score.total >= 50 ? "text-threat-hi" : "text-danger")}>
                <NumberTicker value={score.total} className="text-inherit" />
              </div>
              <div className="pb-2">
                <div className="font-mono text-[11px] text-faint">/ 100</div>
                <div className="font-display text-lg font-semibold">{s.debrief.name}</div>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              <Bar label="Spot" value={score.spot} max={30} />
              <Bar label="Analyze" value={score.analyze} max={30} />
              <Bar label="Respond" value={score.respond} max={40} />
            </div>
            <div className={cn("mt-5 rounded-xl px-4 py-3 text-[14px] ring-1",
              s.responses[resp].p >= 40 ? "bg-safe/10 ring-safe/25" : s.responses[resp].p >= 15 ? "bg-threat/10 ring-threat/25" : "bg-danger/10 ring-danger/25")}>
              <div className="font-medium">{s.responses[resp].t}</div>
              <div className="mt-1 text-mute">{s.responses[resp].out}</div>
            </div>
            {s.responses[resp].p < best.p && <p className="mt-3 text-[13px] text-mute">Best response: <span className="text-ink">{best.t}</span></p>}
            <p className="mt-4 text-[15px] text-ink/90">{s.debrief.lesson}</p>
            <button onClick={() => { setStep(0); setVerdict(null); setEv([]); setResp(null) }} className="mt-5 text-sm text-defense-hi hover:underline">Replay this situation</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function LiveSituation() {
  const [idx, setIdx] = useState(0)
  const s = SAMPLES[idx]
  return (
    <section id="live" className="relative py-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(34,181,214,0.10),transparent_70%)]" />
      <div className="mx-auto max-w-6xl px-[max(20px,env(safe-area-inset-left))]">
        <SectionHead eyebrow="Try it now" title="Every situation is a decision under pressure." sub="Pick a situation below and work it the way students do: spot, analyze, respond, then see the consequence." />
        <div className="mb-6 flex flex-wrap gap-2">
          {SAMPLES.map((x, i) => (
            <button key={x.id} onClick={() => setIdx(i)}
              className={cn("relative rounded-full px-4 py-2 text-sm transition", i === idx ? "text-void" : "text-mute ring-1 ring-white/10 hover:text-ink")}>
              {i === idx && <motion.span layoutId="pill" className="absolute inset-0 rounded-full bg-defense" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className="relative">{x.day} · {x.time} · {x.area}</span>
            </button>
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden rounded-3xl glass">
            <BorderBeam size={160} duration={10} colorFrom="#22b5d6" colorTo="#0891b2" />
            <div className="flex items-center gap-2 border-b border-white/[0.07] px-5 py-3">
              <span className="flex gap-1.5"><i className="size-2.5 rounded-full bg-white/15" /><i className="size-2.5 rounded-full bg-white/15" /><i className="size-2.5 rounded-full bg-white/15" /></span>
              <span className="ml-2 font-mono text-[11px] tracking-wider text-mute uppercase">{s.view.type === "email" ? "Halcyon Mail · Inbox" : s.view.type === "voicemail" ? "Phone · Voicemail" : "Wi-Fi · Choose a network"}</span>
              <span className="ml-auto rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-mute">LEVEL {s.level}</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <Device s={s} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="relative min-h-[460px] overflow-hidden rounded-3xl glass">
            <Decision key={s.id} s={s} />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── THREAT MAP ───────────────────────── */
const HQ: [number, number] = [25.7617, -80.1918]
const ORIGINS: [number, number][] = [[44.4268, 26.1025], [55.7558, 37.6173], [6.5244, 3.3792], [39.9042, 116.4074], [-23.5505, -46.6333], [28.6139, 77.209], [50.4501, 30.5234], [14.5995, 120.9842]]
const GLOBE: COBEOptions = {
  width: 800, height: 800, devicePixelRatio: 2, phi: 0, theta: 0.28, dark: 1, diffuse: 1.4,
  mapSamples: 20000, mapBrightness: 5, baseColor: [0.16, 0.24, 0.38], markerColor: [0.98, 0.62, 0.04], glowColor: [0.08, 0.42, 0.55],
  markers: [{ location: HQ, size: 0.09, color: [0.13, 0.71, 0.84] }, ...ORIGINS.map((o) => ({ location: o, size: 0.045 }))],
  arcs: ORIGINS.map((o) => ({ from: o, to: HQ })), arcColor: [0.98, 0.62, 0.04], arcWidth: 0.6, arcHeight: 0.35, markerElevation: 0.02,
} as COBEOptions

function ThreatMap() {
  const stats = [
    { v: 20.9, d: 1, pre: "$", suf: "B", l: "lost to internet crime reported to the FBI in 2025" },
    { v: 1008597, d: 0, pre: "", suf: "", l: "complaints filed, a record" },
    { v: 893, d: 0, pre: "$", suf: "M", l: "lost to scams involving AI, the first year it was tracked" },
  ]
  return (
    <section id="map" className="relative overflow-hidden py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-[max(20px,env(safe-area-inset-left))] lg:grid-cols-2">
        <div>
          <SectionHead eyebrow="The threat picture" title="Attacks arrive from everywhere. Your people are the perimeter." />
          <div className="grid gap-6">
            {stats.map((s, i) => (
              <BlurFade key={s.l} inView delay={0.1 * i}>
                <div className="flex items-baseline gap-5 border-b border-white/[0.07] pb-5">
                  <div className="min-w-[7.5ch] font-display text-4xl font-semibold text-threat-hi tabular-nums">
                    {s.pre}<NumberTicker value={s.v} decimalPlaces={s.d} className="text-threat-hi" />{s.suf}
                  </div>
                  <div className="text-mute">{s.l}</div>
                </div>
              </BlurFade>
            ))}
          </div>
          <p className="mt-6 font-mono text-[11px] text-faint">Source: FBI Internet Crime Complaint Center, 2025 Internet Crime Report</p>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[560px]">
          <div className="absolute inset-[12%] rounded-full bg-defense/20 blur-[90px]" />
          <Globe config={GLOBE} className="max-w-none" />
          <div className="pointer-events-none absolute bottom-[8%] left-1/2 -translate-x-1/2 rounded-full px-3 py-1.5 font-mono text-[11px] text-defense-hi glass">
            ● Protected: Halcyon Freight HQ
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── REPORT ───────────────────────── */
function Ring({ value }: { value: number }) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true })
  const r = 70, c = 2 * Math.PI * r
  return (
    <svg ref={ref} viewBox="0 0 170 170" className="size-44">
      <circle cx="85" cy="85" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
      <motion.circle cx="85" cy="85" r={r} fill="none" stroke="url(#rg)" strokeWidth="10" strokeLinecap="round" transform="rotate(-90 85 85)"
        strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={inView ? { strokeDashoffset: c * (1 - value / 100) } : {}} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} />
      <defs><linearGradient id="rg" x1="0" x2="1"><stop offset="0" stopColor="#67e3ff" /><stop offset="1" stopColor="#0891b2" /></linearGradient></defs>
    </svg>
  )
}

function Report() {
  const areas = [["Email", 92], ["Phone & Text", 84], ["AI & Deepfakes", 61], ["Network", 88], ["Physical", 95], ["Devices", 79]] as const
  return (
    <section id="report" className="mx-auto max-w-6xl px-[max(20px,env(safe-area-inset-left))] py-28">
      <SectionHead eyebrow="The report card" title="Know exactly where each student is exposed." sub="Scores by vector and by thinking skill, a focus area to drill, and pre/post growth for the class. Example student shown." />
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <BlurFade inView className="relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl p-8 text-center glass">
          <div className="relative grid place-items-center">
            <Ring value={86} />
            <div className="absolute"><div className="font-display text-5xl font-semibold"><NumberTicker value={86} className="text-ink" /></div><div className="font-mono text-[11px] text-faint">/ 100</div></div>
          </div>
          <span className="rounded-full bg-safe/15 px-3 py-1 font-mono text-[11px] tracking-wider text-safe">THREAT-READY</span>
          <div className="text-sm text-mute">Pre-test 58 → Post-test 86 · <span className="text-safe">+28 pts</span></div>
        </BlurFade>
        <BlurFade inView delay={0.1} className="rounded-3xl p-8 glass">
          <div className="grid gap-5 sm:grid-cols-2">
            {areas.map(([a, v], i) => (
              <div key={a}>
                <div className="mb-2 flex justify-between text-sm"><span>{a}</span><span className="font-mono text-mute">{v}%</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.div className={cn("h-full rounded-full", v >= 80 ? "bg-gradient-to-r from-defense to-defense-hi" : "bg-gradient-to-r from-threat to-threat-hi")}
                    initial={{ width: 0 }} whileInView={{ width: v + "%" }} viewport={{ once: true }} transition={{ duration: 1.1, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-4 rounded-2xl border border-threat/25 bg-threat/[0.07] p-4">
            <Bot className="size-5 shrink-0 text-threat-hi" />
            <div className="text-sm"><span className="font-medium text-threat-hi">Focus area: AI & Deepfakes.</span> <span className="text-mute">Missed the voice-clone and prompt-injection situations. Drill this area next.</span></div>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}

/* ───────────────────────── CTA ───────────────────────── */
function Closing() {
  return (
    <section className="mx-auto max-w-6xl px-[max(20px,env(safe-area-inset-left))] pb-24">
      <div className="relative overflow-hidden rounded-[28px] px-8 py-16 text-center glass">
        <ShineBorder shineColor={["#22b5d6", "#f59e0b", "#67e3ff"]} borderWidth={1.5} duration={12} />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_80%_at_50%_100%,rgba(8,145,178,0.25),transparent)]" />
        <Award className="mx-auto size-8 text-threat-hi" />
        <h2 className="mx-auto mt-5 max-w-2xl text-[clamp(30px,4.5vw,50px)] leading-[1.05] font-semibold">Score 85% or higher. Earn your certificate.</h2>
        <p className="mx-auto mt-4 max-w-xl text-mute">Signed by Launching IT Solutions, earned on the full week, challenge week or post-test.</p>
        <div className="mt-8 flex justify-center">
          <ShimmerButton background="linear-gradient(135deg,#0891b2,#0b5f78)" shimmerColor="#a5f3fc" borderRadius="14px" className="px-7 py-3.5 text-[15px] font-semibold">
            <span className="flex items-center gap-2">Clock in <ArrowRight className="size-4" /></span>
          </ShimmerButton>
        </div>
      </div>
      <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 text-sm text-faint">
        <div className="flex items-center gap-3"><img src="/logo.png" alt="" className="size-7" /> Launching IT Solutions · Threat Week</div>
        <div className="font-mono text-[11px]">All companies and people in the simulation are fictional.</div>
      </footer>
    </section>
  )
}

export default function App() {
  return (
    <main>
      <Nav />
      <Hero />
      <Ticker />
      <Vectors />
      <LiveSituation />
      <ThreatMap />
      <Report />
      <Closing />
    </main>
  )
}
