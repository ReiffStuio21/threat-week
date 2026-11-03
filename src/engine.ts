import { AREAS, SCENARIOS } from "./scenarios"

/* ───────── Types ───────── */
type Line = { who: string; text: string }
export type View =
  | { type: "email"; fromName: string; fromAddr: string; to: string; subject: string; body: string; attach?: string[] }
  | { type: "sms"; contact: string; messages: { from: "them" | "me" | "sys"; text: string }[] }
  | { type: "call"; callerName: string; callerNum: string; label: string; lines: Line[] }
  | { type: "chat"; app: string; channel: string; messages: Line[] }
  | { type: "scene"; place: string; narration: string[]; lines: Line[] }
  | { type: "browser"; url: string; tab: string; page: string }
  | { type: "wifi"; place: string; note: string; networks: { name: string; lock: boolean; bars: number }[] }
  | { type: "video"; title: string; tiles: string[]; lines: Line[] }

export type Scenario = {
  id: string
  day: number
  time: string
  area: string
  level: number
  attack: boolean
  view: View
  evidence: { t: string; k: boolean; why: string }[]
  responses: { t: string; p: number; out: string }[]
  debrief: { name: string; lesson: string; dos: string[]; donts: string[] }
}

export type Score = { spot: number; analyze: number; respond: number; total: number }
export type Answer = { verdict: boolean; evidence: number[]; response: number; score: Score }

export type Run = {
  name: string
  mode: string
  queue: string[]
  idx: number
  answers: Record<string, Answer>
  finishedAt?: string
}

export type Summary = {
  name: string
  date: string
  mode: string
  count: number
  overall: number
  skills: { spot: number; analyze: number; respond: number }
  areas: Record<string, number>
  levels: Record<string, number>
  weakest: string | null
}

/* ───────── Lookups ───────── */
export const byId: Record<string, Scenario> = Object.fromEntries(SCENARIOS.map((s) => [s.id, s]))
export const ASSESS = ["m1", "m4", "t1", "t2", "t3", "t4", "t5", "t6", "w3", "w5", "h5", "m8"]
export const CERT_MIN = 85
export const SIGNER = { name: "Shareiff Robinson", title: "CEO, Launching IT Solutions" }

const mins = (t: string) => {
  const m = t.match(/(\d+):(\d+) (AM|PM)/)!
  return ((+m[1] % 12) + (m[3] === "PM" ? 12 : 0)) * 60 + +m[2]
}
export const byClock = (a: Scenario, b: Scenario) => a.day - b.day || mins(a.time) - mins(b.time)
export const isAssess = (m: string) => m.startsWith("assess")

export function modeLabel(mode: string) {
  if (mode === "full") return "Full week"
  if (mode === "challenge") return "Challenge week"
  if (mode === "assess:pre") return "Assessment · Pre-test"
  if (mode === "assess:post") return "Assessment · Post-test"
  return "Practice: " + AREAS[mode.split(":")[1]].label
}

export function queueFor(mode: string) {
  let pool = SCENARIOS
  if (mode === "challenge") pool = SCENARIOS.filter((s) => s.level >= 2)
  else if (isAssess(mode)) pool = SCENARIOS.filter((s) => ASSESS.includes(s.id))
  else if (mode.startsWith("area:")) pool = SCENARIOS.filter((s) => s.area === mode.split(":")[1])
  return [...pool].sort(byClock).map((s) => s.id)
}

/* ───────── Scoring ───────── */
export function scoreOf(s: Scenario, verdict: boolean, evidence: number[], response: number): Score {
  const spot = verdict === s.attack ? 30 : 0
  const keys = s.evidence.filter((e) => e.k).length
  const non = s.evidence.length - keys
  const hits = evidence.filter((i) => s.evidence[i].k).length
  const wrong = evidence.length - hits
  const analyze = Math.round(Math.max(0, hits / keys - (non ? (0.5 * wrong) / non : 0)) * 30)
  const respond = s.responses[response].p
  return { spot, analyze, respond, total: spot + analyze + respond }
}

export function band(p: number): [string, "safe" | "threat" | "danger"] {
  if (p >= 85) return ["Threat-ready", "safe"]
  if (p >= 70) return ["Solid, with gaps", "safe"]
  if (p >= 55) return ["Developing", "threat"]
  return ["At risk", "danger"]
}

export function summarize(r: Run): Summary {
  const ids = r.queue.filter((id) => r.answers[id])
  const areas: Record<string, number[]> = {}
  const lv: Record<string, number[]> = {}
  let tot = 0, sp = 0, an = 0, re = 0
  ids.forEach((id) => {
    const s = byId[id], sc = r.answers[id].score
    tot += sc.total; sp += sc.spot; an += sc.analyze; re += sc.respond
    ;(areas[s.area] ||= []).push(sc.total)
    ;(lv[s.level] ||= []).push(sc.total)
  })
  const n = ids.length || 1
  const avg = (a: number[]) => Math.round(a.reduce((x, y) => x + y, 0) / a.length)
  const areaPct = Object.fromEntries(Object.entries(areas).map(([k, v]) => [k, avg(v)]))
  const levelPct = Object.fromEntries(Object.entries(lv).map(([k, v]) => [k, avg(v)]))
  const weakest = Object.entries(areaPct).sort((a, b) => a[1] - b[1])[0]
  return {
    name: r.name, date: r.finishedAt || new Date().toISOString(), mode: r.mode, count: ids.length,
    overall: Math.round(tot / n),
    skills: { spot: Math.round((sp / (n * 30)) * 100), analyze: Math.round((an / (n * 30)) * 100), respond: Math.round((re / (n * 40)) * 100) },
    areas: areaPct, levels: levelPct, weakest: weakest ? weakest[0] : null,
  }
}

/** Same "LTW1." format the class dashboard in Claude reads. */
export function encodeSummary(sum: Summary) {
  const bytes = new TextEncoder().encode(JSON.stringify(sum))
  let bin = ""
  bytes.forEach((b) => (bin += String.fromCharCode(b)))
  return "LTW1." + btoa(bin)
}

/* ───────── Storage ───────── */
const KEY = "ltw-run-v2"
export function loadRun(): Run | null {
  try { return JSON.parse(localStorage.getItem(KEY) || "null") } catch { return null }
}
export function saveRun(r: Run | null) {
  try { if (r) localStorage.setItem(KEY, JSON.stringify(r)); else localStorage.removeItem(KEY) } catch { /* private mode */ }
}

export { AREAS, SCENARIOS }
export { DAYS } from "./scenarios"
