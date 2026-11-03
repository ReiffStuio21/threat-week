import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "motion/react"
import { Award, Check, Copy, Download, Home, RotateCcw, Target } from "lucide-react"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { ShineBorder } from "@/components/magicui/shine-border"
import { BlurFade } from "@/components/magicui/blur-fade"
import { AREAS, CERT_MIN, DAYS, SIGNER, band, byId, encodeSummary, isAssess, modeLabel, summarize, type Run, type Summary } from "@/engine"
import { cn } from "@/lib/utils"

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

function BarRow({ label, sub, value, i }: { label: string; sub?: string; value: number; i: number }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3 text-sm"><span>{label}{sub && <span className="ml-2 font-mono text-[11px] text-faint">{sub}</span>}</span><span className="font-mono text-mute tabular-nums">{value}%</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
        <motion.div className={cn("h-full rounded-full", value >= 80 ? "bg-gradient-to-r from-defense to-defense-hi" : value >= 60 ? "bg-gradient-to-r from-threat to-threat-hi" : "bg-gradient-to-r from-danger to-rose-400")}
          initial={{ width: 0 }} whileInView={{ width: value + "%" }} viewport={{ once: true }} transition={{ duration: 1.1, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }} />
      </div>
    </div>
  )
}

async function drawCert(cv: HTMLCanvasElement, sum: Summary) {
  try { await Promise.all(['700 80px "Space Grotesk"', '400 28px "Inter"', '600 28px "Inter"', '500 20px "IBM Plex Mono"'].map((f) => document.fonts.load(f))) } catch { /* fallback fonts */ }
  const logo = new Image()
  logo.src = "/logo.png"
  try { await logo.decode() } catch { /* draw without logo */ }
  const x = cv.getContext("2d")!, W = cv.width, H = cv.height
  const NAVY = "#11162E", CYAN = "#0891B2", AMBER = "#D97706", SLATE = "#5A6276"
  const SG = '"Space Grotesk", "Segoe UI", sans-serif', IN = '"Inter", "Segoe UI", sans-serif', MO = '"IBM Plex Mono", Consolas, monospace'
  x.fillStyle = "#FFFFFF"; x.fillRect(0, 0, W, H)
  x.fillStyle = NAVY; x.fillRect(0, 0, W, 22); x.fillRect(0, H - 22, W, 22)
  x.fillStyle = CYAN; x.fillRect(0, 22, W, 8)
  x.fillStyle = AMBER; x.fillRect(0, H - 30, W, 8)
  x.strokeStyle = "#D5D9E4"; x.lineWidth = 2; x.strokeRect(70, 90, W - 140, H - 180)
  x.textAlign = "center"
  if (logo.complete && logo.naturalWidth) x.drawImage(logo, W / 2 - 60, 104, 120, 120)
  x.fillStyle = CYAN; x.font = `500 22px ${MO}`; x.fillText("LAUNCHING IT SOLUTIONS", W / 2, 252)
  x.fillStyle = NAVY; x.font = `700 74px ${SG}`; x.fillText("Certificate of Completion", W / 2, 330)
  x.fillStyle = SLATE; x.font = `400 28px ${IN}`; x.fillText("This certifies that", W / 2, 408)
  let fs = 92; x.font = `700 ${fs}px ${SG}`
  while (x.measureText(sum.name).width > W - 360 && fs > 40) { fs -= 4; x.font = `700 ${fs}px ${SG}` }
  x.fillStyle = NAVY; x.fillText(sum.name, W / 2, 506)
  x.fillStyle = AMBER; x.fillRect(W / 2 - 160, 534, 320, 4)
  x.fillStyle = NAVY; x.font = `400 30px ${IN}`
  x.fillText(`has completed Threat Week (${modeLabel(sum.mode)}), a situational`, W / 2, 610)
  x.fillText(`cybersecurity simulation, with a score of ${sum.overall}%, rated ${band(sum.overall)[0]}.`, W / 2, 654)
  const keys = Object.keys(AREAS).filter((k) => k in sum.areas), colW = Math.min(220, (W - 400) / keys.length)
  keys.forEach((k, i) => {
    const cx = W / 2 + (i - (keys.length - 1) / 2) * colW
    x.fillStyle = CYAN; x.font = `700 40px ${SG}`; x.fillText(sum.areas[k] + "%", cx, 756)
    x.fillStyle = SLATE; x.font = `500 18px ${MO}`; x.fillText(AREAS[k].short.toUpperCase(), cx, 788)
  })
  x.strokeStyle = NAVY; x.lineWidth = 2
  x.beginPath(); x.moveTo(240, 930); x.lineTo(700, 930); x.moveTo(W - 700, 930); x.lineTo(W - 240, 930); x.stroke()
  x.fillStyle = NAVY; x.font = `600 28px ${IN}`
  x.fillText(SIGNER.name, 470, 970)
  x.fillText(new Date(sum.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }), W - 470, 970)
  x.fillStyle = SLATE; x.font = `400 22px ${IN}`; x.fillText(SIGNER.title, 470, 1004); x.fillText("Date completed", W - 470, 1004)
  x.font = `500 16px ${MO}`; x.fillText("ID " + (Date.parse(sum.date) % 1e8).toString(36).toUpperCase(), W / 2, 1022)
}

export function Report({ run, onPractice, onNewRun, onHome }: {
  run: Run
  onPractice: (area: string) => void
  onNewRun: () => void
  onHome: () => void
}) {
  const sum = summarize(run)
  const assess = isAssess(run.mode)
  const [label, tone] = band(sum.overall)
  const missed = run.queue.filter((id) => run.answers[id] && run.answers[id].score.total < 70).map((id) => byId[id])
  const weakMissed = missed.filter((s) => s.area === sum.weakest)
  const certOk = sum.overall >= CERT_MIN && (run.mode === "full" || run.mode === "challenge" || run.mode === "assess:post")
  const code = encodeSummary(sum)
  const cv = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => { if (certOk && cv.current) drawCert(cv.current, sum) }, [certOk]) // eslint-disable-line react-hooks/exhaustive-deps

  const download = () => {
    cv.current?.toBlob((blob) => {
      if (!blob) return
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = `Threat Week Certificate - ${sum.name.replace(/[^\w .-]/g, "")}.png`
      document.body.appendChild(a); a.click(); a.remove()
      setTimeout(() => URL.revokeObjectURL(a.href), 4000)
    }, "image/png")
  }
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2500) }
    catch { (document.getElementById("rescode") as HTMLTextAreaElement | null)?.select() }
  }

  return (
    <section className="mx-auto max-w-6xl px-[max(20px,env(safe-area-inset-left))] pt-28 pb-24">
      <BlurFade className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
        <div className="relative grid place-items-center">
          <Ring value={sum.overall} />
          <div className="absolute text-center"><div className="font-display text-5xl font-semibold"><NumberTicker value={sum.overall} className="text-ink" /></div><div className="font-mono text-[11px] text-faint">/ 100</div></div>
        </div>
        <div>
          <span className={cn("rounded-full px-3 py-1 font-mono text-[11px] tracking-wider uppercase",
            tone === "safe" ? "bg-safe/15 text-safe" : tone === "threat" ? "bg-threat/15 text-threat-hi" : "bg-danger/15 text-danger")}>{label}</span>
          <h1 className="mt-4 text-[clamp(32px,4.5vw,52px)] leading-[1.05] font-semibold">{run.name}’s {assess ? "assessment results" : "report card"}</h1>
          <p className="mt-2 text-mute">{sum.count} situations · {modeLabel(run.mode)} · {new Date(sum.date).toLocaleDateString()}</p>
        </div>
      </BlurFade>

      {certOk ? (
        <BlurFade delay={0.1} className="relative mt-10 grid items-center gap-6 overflow-hidden rounded-3xl p-6 glass md:grid-cols-[0.8fr_1.4fr] md:p-8">
          <ShineBorder shineColor={["#22b5d6", "#f59e0b", "#67e3ff"]} borderWidth={1.5} duration={12} />
          <div>
            <Award className="size-8 text-threat-hi" />
            <h2 className="mt-3 text-2xl font-semibold">You earned your certificate.</h2>
            <p className="mt-2 text-[14px] text-mute">Scores of {CERT_MIN}% or higher on the full week, challenge week or post-test earn a certificate from Launching IT Solutions.</p>
            <button onClick={download} className="mt-5 flex items-center gap-2 rounded-xl bg-defense px-5 py-3 text-sm font-semibold text-void transition hover:bg-defense-hi"><Download className="size-4" /> Download certificate</button>
          </div>
          <canvas ref={cv} width={1600} height={1131} className="h-auto w-full rounded-xl ring-1 ring-white/10" aria-label={`Certificate of completion for ${sum.name}`} />
        </BlurFade>
      ) : (
        <p className="mt-8 text-[14px] text-mute">
          {run.mode === "assess:pre" ? "Next: complete the full week, then take the post-test to measure your growth."
            : `Score ${CERT_MIN}% or higher on the full week, challenge week or post-test to earn a certificate.`}
        </p>
      )}

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <BlurFade inView className="rounded-3xl p-7 glass">
          <h2 className="mb-6 text-xl font-semibold">By threat vector</h2>
          <div className="grid gap-5">
            {Object.keys(AREAS).filter((k) => k in sum.areas).map((k, i) => (
              <BarRow key={k} i={i} label={AREAS[k].label} value={sum.areas[k]} />
            ))}
          </div>
        </BlurFade>
        <BlurFade inView delay={0.08} className="rounded-3xl p-7 glass">
          <h2 className="mb-6 text-xl font-semibold">By thinking skill</h2>
          <div className="grid gap-5">
            <BarRow i={0} label="Spot" sub="attack vs. safe" value={sum.skills.spot} />
            <BarRow i={1} label="Analyze" sub="real evidence" value={sum.skills.analyze} />
            <BarRow i={2} label="Respond" sub="right action" value={sum.skills.respond} />
          </div>
          <h2 className="mt-8 mb-6 text-xl font-semibold">By difficulty</h2>
          <div className="grid gap-5">
            {["1", "2", "3"].filter((l) => l in sum.levels).map((l, i) => <BarRow key={l} i={i} label={"Level " + l} value={sum.levels[l]} />)}
          </div>
        </BlurFade>
      </div>

      {sum.weakest && (
        <BlurFade inView className="mt-5 rounded-3xl border border-threat/25 bg-threat/[0.06] p-7">
          <div className="eyebrow !text-threat-hi">Focus area</div>
          <h2 className="mt-2 text-2xl font-semibold">{AREAS[sum.weakest].label} · {sum.areas[sum.weakest]}%</h2>
          {assess ? (
            <p className="mt-3 max-w-2xl text-mute">Answers stay hidden in assessments so the {run.mode === "assess:pre" ? "post-test stays" : "results stay"} a fair measure. The full week walks through every one of these situations with feedback.</p>
          ) : weakMissed.length ? (
            <div className="mt-4 grid gap-3">
              {weakMissed.map((s) => <div key={s.id} className="border-l-2 border-threat/60 pl-4"><div className="font-medium">{s.debrief.name}</div><div className="text-[14px] text-mute">{s.debrief.lesson}</div></div>)}
            </div>
          ) : <p className="mt-3 text-mute">This was your lowest area, but you didn’t miss any situations badly. Keep sharpening it.</p>}
          <button onClick={() => onPractice(sum.weakest!)} className="mt-6 flex items-center gap-2 rounded-xl bg-threat px-5 py-2.5 text-sm font-semibold text-void"><Target className="size-4" /> Practice {AREAS[sum.weakest].short}</button>
        </BlurFade>
      )}

      {!assess && missed.length > 0 && (
        <BlurFade inView className="mt-5 rounded-3xl p-7 glass">
          <h2 className="text-xl font-semibold">Situations to review ({missed.length})</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {missed.map((s) => (
              <div key={s.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-faint"><span>{DAYS[s.day]} · {s.time}</span><span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-mute">{AREAS[s.area].short}</span><span className="ml-auto text-threat-hi">{run.answers[s.id].score.total}/100</span></div>
                <div className="mt-2 font-medium">{s.debrief.name}</div>
                <div className="mt-1 text-[14px] text-mute">{s.debrief.lesson}</div>
              </div>
            ))}
          </div>
        </BlurFade>
      )}

      <BlurFade inView className="mt-5 rounded-3xl p-7 glass">
        <h2 className="text-xl font-semibold">Send your results to your instructor</h2>
        <p className="mt-2 max-w-2xl text-[14px] text-mute">Copy this results code and send it to your instructor by email, text or your class chat. It adds your scores to the class dashboard.</p>
        <textarea id="rescode" readOnly value={code} rows={3} onFocus={(e) => e.currentTarget.select()}
          className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-black/30 p-3 font-mono text-[11.5px] break-all text-mute outline-none" />
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={copy} className="flex items-center gap-2 rounded-xl bg-defense px-5 py-2.5 text-sm font-semibold text-void transition hover:bg-defense-hi">
            {copied ? <><Check className="size-4" /> Copied</> : <><Copy className="size-4" /> Copy results code</>}
          </button>
          <button onClick={onNewRun} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm ring-1 ring-white/15 transition hover:bg-white/[0.05]"><RotateCcw className="size-4" /> Start a new run</button>
          <button onClick={onHome} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm text-mute transition hover:text-ink"><Home className="size-4" /> Home</button>
        </div>
      </BlurFade>
    </section>
  )
}
