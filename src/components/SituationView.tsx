import { useEffect, useRef, type ReactNode } from "react"
import { motion } from "motion/react"
import { Lock, MapPin, Paperclip, Phone, Wifi } from "lucide-react"
import type { Scenario } from "@/engine"
import { cn } from "@/lib/utils"

const initials = (n: string) => n.replace(/\(.*?\)/g, "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase()

function Chrome({ label, children, right }: { label: ReactNode; children: ReactNode; right?: ReactNode }) {
  return (
    <>
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-5 py-3">
        <span className="flex gap-1.5"><i className="size-2.5 rounded-full bg-white/15" /><i className="size-2.5 rounded-full bg-white/15" /><i className="size-2.5 rounded-full bg-white/15" /></span>
        <span className="ml-2 min-w-0 truncate font-mono text-[11px] tracking-wider text-mute uppercase">{label}</span>
        {right && <span className="ml-auto shrink-0">{right}</span>}
      </div>
      {children}
    </>
  )
}

function Quote({ who, text, note }: { who: string; text: string; note?: boolean }) {
  return (
    <div className={cn(note ? "" : "border-l-2 border-white/10 pl-4")}>
      <div className="font-mono text-[10.5px] tracking-[0.14em] text-faint uppercase">{who}</div>
      <p className={cn("mt-1 text-[15px] leading-relaxed", note ? "text-mute italic" : "text-ink/90")}>{text}</p>
    </div>
  )
}

/** Renders the "device" a situation happens on: inbox, phone, call, chat, browser, Wi-Fi list, video call, or a real-world scene. */
export function SituationView({ s, levelTag }: { s: Scenario; levelTag?: ReactNode }) {
  const v = s.view
  const bodyRef = useRef<HTMLDivElement>(null)

  // Link inspector: tapping a link shows its real destination instead of opening it.
  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    const onClick = (e: MouseEvent) => {
      const l = (e.target as HTMLElement).closest(".lnk") as HTMLElement | null
      if (!l) return
      e.preventDefault()
      const nx = l.nextElementSibling
      if (nx?.classList.contains("lnk-tip")) { nx.remove(); return }
      const tip = document.createElement("span")
      tip.className = "lnk-tip"
      tip.textContent = "Real destination → " + l.dataset.href
      l.after(tip)
    }
    el.addEventListener("click", onClick)
    return () => el.removeEventListener("click", onClick)
  }, [s.id])

  if (v.type === "email") {
    const hasLink = v.body.includes("lnk")
    return (
      <Chrome label="Halcyon Mail · Inbox" right={levelTag}>
        <div className="p-6">
          <div className="font-display text-xl leading-snug font-semibold">{v.subject}</div>
          <div className="mt-4 flex items-center gap-3 border-b border-white/[0.07] pb-4">
            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-defense/15 text-[13px] font-semibold text-defense-hi">{initials(v.fromName)}</div>
            <div className="min-w-0">
              <div className="font-medium">{v.fromName}</div>
              <div className="font-mono text-[12px] break-all text-mute">&lt;{v.fromAddr}&gt;</div>
              <div className="font-mono text-[11px] text-faint">To: {v.to}</div>
            </div>
          </div>
          <div ref={bodyRef} className="mail-body mt-4" dangerouslySetInnerHTML={{ __html: v.body }} />
          {v.attach && (
            <div className="mt-5 flex flex-wrap gap-2">
              {v.attach.map((a) => (
                <span key={a} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[12px]"><Paperclip className="size-3.5 text-mute" />{a}</span>
              ))}
            </div>
          )}
          {hasLink && <div className="mt-5 font-mono text-[11px] text-faint">Tap a link to inspect where it really goes, without opening it.</div>}
        </div>
      </Chrome>
    )
  }

  if (v.type === "sms") {
    return (
      <Chrome label="Messages" right={levelTag}>
        <div className="mx-auto max-w-md p-6">
          <div className="mb-4 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-white/[0.06] text-mute"><Phone className="size-5" /></div>
            <div className="mt-2 text-sm font-medium">{v.contact}</div>
          </div>
          <div className="grid gap-2.5">
            {v.messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.15 + i * 0.35 }}
                className={cn("max-w-[88%] rounded-2xl px-4 py-2.5 text-[14.5px] leading-relaxed",
                  m.from === "them" && "rounded-bl-md bg-white/[0.08]",
                  m.from === "me" && "ml-auto rounded-br-md bg-brand text-white",
                  m.from === "sys" && "max-w-full border border-white/[0.08] bg-transparent font-mono text-[12.5px] text-mute")}>
                {m.text}
              </motion.div>
            ))}
          </div>
        </div>
      </Chrome>
    )
  }

  if (v.type === "call") {
    return (
      <Chrome label={"Phone · " + v.label} right={levelTag}>
        <div className="p-6">
          <div className="flex flex-col items-center gap-2 border-b border-white/[0.07] pb-6 text-center">
            <div className="relative grid size-16 place-items-center rounded-full bg-defense/10 ring-1 ring-defense/30">
              <span className="absolute inset-0 animate-ping-slow rounded-full ring-1 ring-defense/40" />
              <Phone className="size-6 text-defense-hi" />
            </div>
            <div className="font-display text-xl font-semibold">{v.callerName}</div>
            <div className="font-mono text-[12px] text-mute">{v.callerNum}</div>
            <div className="mt-2 flex h-7 items-end gap-[3px]" aria-hidden="true">
              {Array.from({ length: 36 }).map((_, i) => (
                <motion.span key={i} className="w-[3px] rounded-full bg-defense/70"
                  animate={{ height: [5, 7 + ((i * 37) % 19), 5] }} transition={{ duration: 1.1 + (i % 5) * 0.12, repeat: Infinity, ease: "easeInOut" }} />
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-4">
            {v.lines.map((l, i) => <Quote key={i} who={l.who} text={l.text} note={/note|text on/i.test(l.who)} />)}
          </div>
        </div>
      </Chrome>
    )
  }

  if (v.type === "chat") {
    return (
      <Chrome label={v.app + " · " + v.channel} right={levelTag}>
        <div className="grid gap-4 p-6">
          {v.messages.map((m, i) =>
            m.who === "Context" ? (
              <div key={i} className="rounded-xl bg-white/[0.04] px-4 py-3 text-[14px] text-mute italic">{m.text}</div>
            ) : (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.25 }} className="flex gap-3">
                <div className={cn("grid size-9 shrink-0 place-items-center rounded-full text-[12px] font-semibold",
                  m.who === "You" ? "bg-white/[0.08] text-ink" : "bg-defense/15 text-defense-hi")}>{initials(m.who)}</div>
                <div className="min-w-0">
                  <div className="text-[13.5px] font-semibold">{m.who}</div>
                  <p className="mt-0.5 text-[15px] leading-relaxed text-ink/90">{m.text}</p>
                </div>
              </motion.div>
            )
          )}
        </div>
      </Chrome>
    )
  }

  if (v.type === "scene") {
    return (
      <Chrome label="On location" right={levelTag}>
        <div className="grid gap-4 p-6">
          <div className="flex items-center gap-2 font-mono text-[12px] tracking-wider text-defense-hi uppercase"><MapPin className="size-4" />{v.place}</div>
          {v.narration.map((p, i) => <p key={i} className="text-[16px] leading-relaxed text-ink/90">{p}</p>)}
          {v.lines.map((l, i) => (
            <div key={i} className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
              <div className="font-mono text-[10.5px] tracking-[0.14em] text-faint uppercase">{l.who}</div>
              <p className="mt-1 text-[15px] leading-relaxed">{l.text}</p>
            </div>
          ))}
        </div>
      </Chrome>
    )
  }

  if (v.type === "browser") {
    const app = !/^https?:/.test(v.url), secure = v.url.startsWith("https")
    return (
      <Chrome label={v.tab} right={levelTag}>
        <div className="px-5 pt-4">
          <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 font-mono text-[12px] break-all ring-1 ring-white/[0.06]">
            {!app && (secure ? <Lock className="size-3.5 shrink-0 text-safe" /> : <span className="shrink-0 font-semibold text-threat-hi">Not secure</span>)}
            <span className="text-ink/80">{v.url}</span>
          </div>
        </div>
        <div className="browser-page p-5" dangerouslySetInnerHTML={{ __html: v.page }} />
      </Chrome>
    )
  }

  if (v.type === "wifi") {
    return (
      <Chrome label="Wi-Fi · Choose a network" right={levelTag}>
        <div className="p-6">
          <div className="flex items-center gap-2 font-mono text-[12px] tracking-wider text-defense-hi uppercase"><MapPin className="size-4" />{v.place}</div>
          <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08]">
            {v.networks.map((n) => (
              <div key={n.name} className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3 last:border-0">
                <Wifi className="size-4 text-mute" />
                <span className="min-w-0 flex-1 font-medium break-words">{n.name}</span>
                <span className="font-mono text-[11px] text-mute">{n.lock ? <span className="flex items-center gap-1"><Lock className="size-3" /> Secured</span> : "Open"}</span>
                <span className="flex h-3.5 items-end gap-[2px]">{[1, 2, 3, 4].map((b) => <i key={b} className={cn("w-[3px] rounded-sm", b <= n.bars ? "bg-ink" : "bg-white/15")} style={{ height: b * 3 + 2 }} />)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-threat/10 px-4 py-3 text-[14px] text-threat-hi ring-1 ring-threat/20">{v.note}</div>
        </div>
      </Chrome>
    )
  }

  // video call
  return (
    <Chrome label={"Video call · " + v.title} right={levelTag}>
      <div className="grid grid-cols-2 gap-1.5 bg-black/40 p-2">
        {v.tiles.map((t) => (
          <div key={t} className={cn("relative grid aspect-video place-items-center rounded-lg font-display text-2xl font-semibold", t === "You" ? "bg-white/[0.06]" : "bg-defense/[0.08]")}>
            {t === "You" ? "You" : initials(t)}
            <span className="absolute bottom-1.5 left-2 rounded bg-black/50 px-1.5 py-0.5 text-[11px] font-normal">{t}</span>
          </div>
        ))}
      </div>
      <div className="grid gap-4 p-6">
        {v.lines.map((l, i) => <Quote key={i} who={l.who} text={l.text} note={/notice|context/i.test(l.who)} />)}
      </div>
    </Chrome>
  )
}
