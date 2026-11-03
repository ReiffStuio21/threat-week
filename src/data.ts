export type Evidence = { t: string; k: boolean; why: string }
export type Response = { t: string; p: number; out: string }
export type Scenario = {
  id: string
  day: string
  time: string
  area: string
  level: number
  attack: boolean
  view:
    | { type: "email"; fromName: string; fromAddr: string; to: string; subject: string; body: string; link?: { text: string; href: string } }
    | { type: "voicemail"; callerName: string; callerNum: string; transcript: string; note: string }
    | { type: "wifi"; place: string; note: string; networks: { name: string; lock: boolean; bars: number }[] }
  evidence: Evidence[]
  responses: Response[]
  debrief: { name: string; lesson: string; dos: string[]; donts: string[] }
}

export const SAMPLES: Scenario[] = [
  {
    id: "m3", day: "Monday", time: "10:15 AM", area: "Email", level: 1, attack: true,
    view: {
      type: "email", fromName: "IT Help Desk", fromAddr: "support@halcyon-freight-it.com", to: "you@halcyonfreight.com",
      subject: "ACTION REQUIRED: Your password expires in 2 hours",
      body: "Dear User,\n\nOur records show your Halcyon network password will expire in 2 hours. To avoid losing access to email and files, verify your account now:\n\n{link}\n\nFailure to verify will result in account suspension.\n\nThank you,\nHalcyon IT Help Desk",
      link: { text: "https://portal.halcyonfreight.com/reset", href: "http://halcyonfreight.login-verify.co/reset?u=new" },
    },
    evidence: [
      { t: "Sender domain is halcyon-freight-it.com, not halcyonfreight.com", k: true, why: "A look-alike domain with an extra hyphen and \"-it\". Real IT mail comes from the real domain." },
      { t: "Link text and the real destination don't match", k: true, why: "The text shows the company portal, but the link goes to login-verify.co." },
      { t: "Extreme urgency: 2 hours, then suspension", k: true, why: "Short deadlines push you to act before you think." },
      { t: "Generic greeting: \"Dear User\"", k: true, why: "Your own IT team knows your name." },
      { t: "The email mentions Halcyon by name", k: false, why: "Company names and logos are public and easy to copy." },
    ],
    responses: [
      { t: "Click the link and update your password.", p: 0, out: "The page looks just like the portal. An hour later, someone in another country is reading your inbox." },
      { t: "Reply and ask if this is real.", p: 5, out: "Your reply goes straight to the attacker, who says \"Yes, please hurry.\"" },
      { t: "Use the Report Phishing button, then delete it.", p: 40, out: "Security pulls the same email from 40 other inboxes within minutes. Your report protected people who might have clicked." },
      { t: "Forward it to coworkers to warn them.", p: 15, out: "Well meant, but forwarding spreads the live link. One coworker clicks it by accident." },
    ],
    debrief: { name: "Credential phishing", lesson: "Check the sender's real domain and inspect links before trusting them. Urgency plus a login link is the classic phishing combo.",
      dos: ["Inspect where a link really goes", "Report with the Report Phishing button"], donts: ["Reply to ask if it's real", "Forward phishing to coworkers"] },
  },
  {
    id: "t5", day: "Tuesday", time: "1:30 PM", area: "AI & Deepfakes", level: 2, attack: true,
    view: {
      type: "voicemail", callerName: "Priya Shah (Manager)", callerNum: "Unknown number",
      transcript: "Hey, it's Priya. I'm stuck at the client site and my phone's about to die, so this is a borrowed one. Can you grab five $200 gift cards from the pharmacy downstairs? Thank-yous for the client team. Text photos of the codes to this number and I'll reimburse you today. You're a lifesaver.",
      note: "It sounds exactly like Priya. She spoke at a public conference last month, and the video is online.",
    },
    evidence: [
      { t: "Asks for gift cards and photos of the codes", k: true, why: "Gift cards are fast and nearly untraceable. No real business pays this way." },
      { t: "The voice sounds exactly like her", k: false, why: "AI can clone a voice from a short public clip. A perfect match is no longer proof." },
      { t: "Calling from an unknown \"borrowed\" phone", k: true, why: "An excuse that blocks you from verifying the normal way." },
      { t: "Urgency and a reason she can't talk", k: true, why: "\"Phone's about to die\" keeps you from calling back." },
    ],
    responses: [
      { t: "Buy the cards. It's definitely her voice.", p: 0, out: "$1,000 drained in minutes. The real Priya was in a meeting the whole time." },
      { t: "Text the number back to ask a few questions.", p: 10, out: "The \"borrowed phone\" answers instantly with convincing details." },
      { t: "Contact Priya on her known number or in team chat, and report the voicemail.", p: 40, out: "Priya replies in a minute: \"Not me!\" Security sends a team-wide alert about the voice clone." },
    ],
    debrief: { name: "AI voice-clone impersonation", lesson: "A familiar voice is no longer proof of identity. Verify unusual requests on a channel you already trust.",
      dos: ["Call back on a number you already have", "Agree on a code word for money requests"], donts: ["Pay with gift cards", "Treat a voice match as verification"] },
  },
  {
    id: "t1", day: "Tuesday", time: "8:10 AM", area: "Network & Wi-Fi", level: 1, attack: true,
    view: {
      type: "wifi", place: "BeanThere Café, across from the office",
      note: "Sign at the register: Guest Wi-Fi is BeanThere_Guest. Password printed on your receipt.",
      networks: [
        { name: "BeanThere Free WiFi", lock: false, bars: 4 },
        { name: "BeanThere_Guest", lock: true, bars: 3 },
        { name: "BeanThere_Guest_5G", lock: false, bars: 4 },
        { name: "HP-Print-3F", lock: true, bars: 1 },
      ],
    },
    evidence: [
      { t: "Several networks with near-identical names", k: true, why: "Attackers create look-alike \"evil twin\" networks beside the real one." },
      { t: "The posted network needs a password; the look-alikes are open", k: true, why: "The café told you which network is theirs." },
      { t: "The open networks have the strongest signal", k: false, why: "Signal strength isn't a trust signal. A hotspot can sit two tables away." },
    ],
    responses: [
      { t: "Join the open network with the best signal.", p: 0, out: "It's the attacker's laptop. Your traffic flows through their machine for the next hour." },
      { t: "Join \"BeanThere Free WiFi\" but skip banking sites.", p: 10, out: "An evil twin can still capture logins and redirect pages, not only banking." },
      { t: "Join the posted network with the receipt password and turn on the company VPN.", p: 40, out: "You're on the real network, and the VPN encrypts everything on top of it." },
    ],
    debrief: { name: "Evil-twin Wi-Fi", lesson: "Confirm the exact network name, prefer password-protected networks, and use a VPN or your own hotspot.",
      dos: ["Ask staff for the real network name", "Use a VPN on public Wi-Fi"], donts: ["Pick networks by signal strength"] },
  },
]

export function scoreOf(s: Scenario, verdict: boolean, evidence: number[], response: number) {
  const spot = verdict === s.attack ? 30 : 0
  const keys = s.evidence.filter((e) => e.k).length
  const non = s.evidence.length - keys
  const hits = evidence.filter((i) => s.evidence[i].k).length
  const wrong = evidence.length - hits
  const analyze = Math.round(Math.max(0, hits / keys - (non ? (0.5 * wrong) / non : 0)) * 30)
  const respond = s.responses[response].p
  return { spot, analyze, respond, total: spot + analyze + respond }
}
