import type { Scenario } from "./engine"

export const AREAS: Record<string, { label: string; short: string }> = {
  email:    { label: "Email", short: "Email" },
  phone:    { label: "Phone, Text & Social", short: "Phone & Text" },
  ai:       { label: "AI & Deepfakes", short: "AI" },
  network:  { label: "Network & Wi-Fi", short: "Network" },
  physical: { label: "Physical Security", short: "Physical" },
  devices:  { label: "Devices & Accounts", short: "Devices" }
};
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const SCENARIOS: Scenario[] = [
/* ───────── MONDAY ───────── */
{ id: "m1", day: 0, time: "8:45 AM", area: "physical", level: 1, attack: true,
  view: { type: "scene", place: "Main entrance, Halcyon Freight HQ",
    narration: ["It's your first day. You badge in at the side door. Behind you, a man in a polo shirt is balancing two boxes and a coffee tray. You don't see a badge on him."],
    lines: [{ who: "Man with boxes", text: "Hey, can you grab the door? Forgot my badge in the truck. I'm with facilities, just dropping off supplies." }] },
  evidence: [
    { t: "No visible badge or visitor sticker", k: true, why: "Everyone inside should have a badge or a visitor pass. Not seeing one is the first red flag." },
    { t: "His hands are full, so refusing feels rude", k: true, why: "Tailgaters use full hands and politeness on purpose. The pressure you feel is the technique." },
    { t: "Claims to be facilities, with nothing you can check", k: true, why: "A job title is easy to say. There's no work order, escort or badge to back it up." },
    { t: "He's friendly and relaxed", k: false, why: "Friendliness tells you nothing. Skilled social engineers are usually pleasant." },
    { t: "It's early in the morning", k: false, why: "Time of day doesn't matter here. Tailgating happens at every shift change." }
  ],
  responses: [
    { t: "Hold the door. He's clearly busy and it's only supplies.", p: 0, out: "He walks in behind you. Later that week a laptop cart goes missing from the third floor, and badge logs show only your entry." },
    { t: "Let him in, then mention it to security later.", p: 10, out: "Reporting is good, but by then he's already inside and unescorted. Access control works at the door, not after." },
    { t: "Say, \"Sorry, I can't let anyone in. Reception can sign you in right around the front.\"", p: 40, out: "He shrugs and heads to the front. Reception checks his name against the delivery schedule. Policy did the hard part for you." },
    { t: "Ask his name and which department he works for, then let him in.", p: 5, out: "He gives a confident name and department. You can't verify either one, so the question changed nothing." }
  ],
  debrief: { name: "Tailgating (piggybacking)", lesson: "Physical access is only as strong as the people at the door. A polite \"I can't, but reception can help\" protects everyone.",
    dos: ["Point people without badges to reception", "Let the policy be the bad guy", "Report repeat attempts to security"],
    donts: ["Hold secure doors for anyone without a badge", "Let full hands or friendliness rush you"] } },

{ id: "m2", day: 0, time: "9:30 AM", area: "email", level: 1, attack: false,
  view: { type: "email", fromName: "Halcyon People Team", fromAddr: "hr@halcyonfreight.com", to: "you@halcyonfreight.com",
    subject: "Welcome aboard! Your first-week checklist",
    body: "<p>Hi and welcome to Halcyon Freight!</p><p>Your manager, Priya Shah, will meet you at 10:00 in Conference Room B. Before Friday, please complete your required security awareness module.</p><p>To find it, open the <b>Halcyon intranet</b> from the bookmark on your laptop and choose <b>Learning &gt; My Courses</b>. You'll sign in with the password IT gave you this morning.</p><p>We will never ask for your password by email. If anything looks off, use the Report button in your mail app.</p><p>Glad you're here!<br>The People Team</p>" },
  evidence: [
    { t: "Sender address uses the real company domain (halcyonfreight.com)", k: true, why: "The domain matches exactly. That alone isn't proof, but it fits with everything else." },
    { t: "Doesn't ask for your password, payment or personal data", k: true, why: "Legitimate onboarding emails point you to systems. They don't ask you to hand over secrets." },
    { t: "Sends you to a known bookmark instead of a link", k: true, why: "Navigating on your own is the safest pattern, and it's exactly what this email tells you to do." },
    { t: "The tone is upbeat with exclamation points", k: false, why: "Tone isn't evidence in either direction." },
    { t: "It arrived on your first morning", k: false, why: "Timing fits, but attackers also target new hires on day one. Timing alone proves nothing." }
  ],
  responses: [
    { t: "Report it as phishing just to be safe.", p: 10, out: "IT confirms it's real. Caution is fine, but reporting every normal email slows the team down. Part of the skill is recognizing what's safe." },
    { t: "Open the intranet from your bookmark and start the course.", p: 40, out: "You're signed in and through the first lesson before your 10:00 meeting. This is what a safe email looks like." },
    { t: "Ignore it until someone reminds you.", p: 10, out: "Friday comes and your account is flagged for incomplete training. Safe emails still need action." }
  ],
  debrief: { name: "Legitimate email", lesson: "Not everything is an attack. Real messages from your company tell you where to go, never ask for secrets, and match what you expect.",
    dos: ["Check sender domain, requests and context together", "Navigate to systems through bookmarks you trust"],
    donts: ["Treat every message as hostile", "Assume an email is safe based on one signal alone"] } },

{ id: "m3", day: 0, time: "10:15 AM", area: "email", level: 1, attack: true,
  view: { type: "email", fromName: "IT Help Desk", fromAddr: "support@halcyon-freight-it.com", to: "you@halcyonfreight.com",
    subject: "ACTION REQUIRED: Your password expires in 2 hours",
    body: "<p>Dear User,</p><p>Our records show your Halcyon network password will expire in <b>2 hours</b>. To avoid losing access to email and files, verify your account now:</p><p><span class=\"lnk\" data-href=\"http://halcyonfreight.login-verify.co/reset?u=new\">https://portal.halcyonfreight.com/reset</span></p><p>Failure to verify will result in account suspension.</p><p>Thank you,<br>Halcyon IT Help Desk</p>" },
  evidence: [
    { t: "Sender domain is halcyon-freight-it.com, not halcyonfreight.com", k: true, why: "A look-alike domain with an extra hyphen and \"-it\". Real IT mail comes from the real domain." },
    { t: "Link text and the real destination don't match", k: true, why: "The text shows the company portal, but the link goes to login-verify.co. Always inspect before clicking." },
    { t: "Extreme urgency: 2 hours, then suspension", k: true, why: "Short deadlines push you to act before you think." },
    { t: "Generic greeting: \"Dear User\"", k: true, why: "Your own IT team knows your name. Generic greetings suggest a mass campaign." },
    { t: "The email mentions Halcyon by name", k: false, why: "Company names and logos are public and easy to copy. They aren't proof." }
  ],
  responses: [
    { t: "Click the link and update your password.", p: 0, out: "The page looks just like the portal. You type your password and it \"times out.\" An hour later, someone in another country is reading your inbox." },
    { t: "Reply and ask if this is real.", p: 5, out: "Your reply goes straight to the attacker, who says \"Yes, please hurry.\" Never verify through the suspicious message itself." },
    { t: "Use the Report Phishing button, then delete it.", p: 40, out: "Security pulls the same email from 40 other inboxes within minutes. Your report protected people who might have clicked." },
    { t: "Forward it to coworkers to warn them.", p: 15, out: "Well meant, but forwarding spreads the live link. One coworker clicks it by accident. Report to security instead." }
  ],
  debrief: { name: "Credential phishing", lesson: "Check the sender's real domain and hover over links before trusting them. Urgency plus a login link is the classic phishing combo.",
    dos: ["Hover or long-press to see where a link really goes", "Report with the Report Phishing button", "Change passwords through sites you navigate to yourself"],
    donts: ["Reply to suspicious emails to ask if they're real", "Forward phishing to coworkers"] } },

{ id: "m4", day: 0, time: "11:40 AM", area: "phone", level: 1, attack: true,
  view: { type: "sms", contact: "+1 (305) 555-0187", messages: [
    { from: "them", text: "ParcelPoint: Your package is held at our depot due to an incomplete address. A $1.99 redelivery fee is required. Update within 24h: parcelpoint-redeliver.info/us" } ] },
  evidence: [
    { t: "Asks for a small payment to release a package", k: true, why: "Small fees feel harmless. The real goal is your card number." },
    { t: "Link goes to an odd domain, not the carrier's main site", k: true, why: "Carriers use their own domain. \"-redeliver.info\" is a throwaway site." },
    { t: "No tracking number, order or name", k: true, why: "A real notice names your shipment. This could be sent to anyone." },
    { t: "Sent from an ordinary 10-digit number", k: true, why: "Businesses usually text from short codes. A random personal number is a warning sign." },
    { t: "It arrived during work hours", k: false, why: "Timing isn't meaningful here." }
  ],
  responses: [
    { t: "Reply STOP so they stop texting.", p: 10, out: "Replying confirms your number is active. Your scam texts double the next week." },
    { t: "Delete it, report it as junk, and check any real orders in the store's app.", p: 40, out: "Your actual order is on schedule. Reporting junk helps carriers block the sender." },
    { t: "Tap the link and pay. It's only $1.99.", p: 0, out: "The fee goes through. Three days later, $640 in charges show up on that card." },
    { t: "Call the number back to ask about the package.", p: 5, out: "A friendly \"agent\" asks for your card to \"verify.\" You've just turned a text scam into a phone scam." }
  ],
  debrief: { name: "Smishing (SMS phishing)", lesson: "Delivery and toll texts are the most common smishing lures. Check orders in the official app or site, never through a texted link.",
    dos: ["Report junk texts to your carrier", "Track packages from the store or carrier app"],
    donts: ["Pay fees through text-message links", "Reply STOP to unknown senders"] } },

{ id: "m5", day: 0, time: "2:00 PM", area: "devices", level: 1, attack: true,
  view: { type: "browser", url: "http://secure-pc-alert.support-check.net/warning", tab: "⚠ WARNING",
    page: "<div class=\"bw-alert\"><p class=\"bw-big\">YOUR COMPUTER IS INFECTED</p><p>Spyware has been detected on this PC (Error #0x268d3). Your files, passwords and banking information are at risk.</p><p>Do NOT restart or close this window. Call Halcyon Technical Support immediately:</p><p class=\"bw-phone\">1-888-555-0142</p><p class=\"bw-fine\">An alarm sound is playing. The window keeps returning to full screen.</p></div>" },
  evidence: [
    { t: "A web page claims it scanned your computer", k: true, why: "Websites can't scan your computer. Only installed security software can." },
    { t: "Tells you to call a phone number", k: true, why: "Real security alerts never ask you to call a number shown in a pop-up." },
    { t: "Says not to close or restart", k: true, why: "Scareware tries to keep you on the page. Closing it is exactly what you should do." },
    { t: "Alarm sounds and full-screen lock", k: true, why: "Noise and panic are designed to stop you from thinking." },
    { t: "Uses an official-looking error code", k: false, why: "Fake error codes are decoration and prove nothing." }
  ],
  responses: [
    { t: "Call the number so they can remove the virus.", p: 0, out: "The \"technician\" asks you to install remote-access software, then demands $399. Now they control your PC." },
    { t: "Close the tab (or force-quit the browser) and tell IT what you saw.", p: 40, out: "The page closes. IT checks the machine, finds nothing, and blocks the site for everyone." },
    { t: "Click \"Scan Now\" on the page.", p: 0, out: "The button downloads a real piece of malware disguised as a cleaner." },
    { t: "Restart the computer and forget about it.", p: 20, out: "The pop-up is gone, but IT never learns the site exists, and a coworker hits it tomorrow." }
  ],
  debrief: { name: "Tech-support scam (scareware)", lesson: "Browsers can't detect viruses on your PC, and real help desks don't put phone numbers in pop-ups. Close it and report it.",
    dos: ["Force-quit the browser if a page won't close", "Tell IT about the site"],
    donts: ["Call numbers from pop-ups", "Give anyone remote access you didn't arrange through IT"] } },

{ id: "m6", day: 0, time: "4:30 PM", area: "devices", level: 2, attack: true,
  view: { type: "chat", app: "Halcyon Chat", channel: "Direct message", messages: [
    { who: "Dana Ruiz (IT)", text: "Hi! 👋 Welcome to Halcyon. I'm finishing your MFA enrollment for the new phone policy." },
    { who: "Dana Ruiz (IT)", text: "I'm sending a 6-digit code to your phone right now. Just paste it here so I can confirm your enrollment went through. Takes 10 seconds!" } ] },
  evidence: [
    { t: "Asks you to share a one-time code", k: true, why: "One-time codes are a second key to your account. Whoever has the code can log in as you." },
    { t: "IT staff never need your codes or passwords", k: true, why: "IT can reset accounts without your secrets. A request for a code is the giveaway." },
    { t: "Message comes from an internal company account", k: false, why: "That isn't a trust signal. Internal accounts get compromised, and attackers love using them." },
    { t: "Friendly tone with an emoji", k: false, why: "Tone tells you nothing either way." },
    { t: "Minimizes the request (\"takes 10 seconds\")", k: true, why: "Making a risky step sound trivial lowers your guard." }
  ],
  responses: [
    { t: "Paste the code. It's IT, and it's quick.", p: 0, out: "The code was for a login to your account from someone else's computer. They're in." },
    { t: "Ask \"Are you really from IT?\" in the same chat.", p: 10, out: "\"Yep! Dana from the service desk 😊\" Asking the suspect to vouch for themselves proves nothing." },
    { t: "Don't share it. Call the Service Desk at the number on the intranet and report the message.", p: 40, out: "The Service Desk confirms Dana's account was taken over this morning. They lock it and warn others." },
    { t: "Ignore the message.", p: 15, out: "You stayed safe, but Dana's hijacked account keeps messaging new hires. Reporting would have stopped it." }
  ],
  debrief: { name: "MFA code theft via internal impersonation", lesson: "No one legitimate ever needs your one-time codes. Verify by contacting the person through a separate, trusted channel.",
    dos: ["Verify through a second channel you look up yourself", "Report compromised-looking internal accounts"],
    donts: ["Share codes, even with \"IT\"", "Trust a message just because it came from inside"] } },

/* ───────── TUESDAY ───────── */
{ id: "t1", day: 1, time: "8:10 AM", area: "network", level: 1, attack: true,
  view: { type: "wifi", place: "BeanThere Café, across from the office",
    note: "A sign by the register says: Guest Wi-Fi: BeanThere_Guest. Password printed on your receipt.",
    networks: [
      { name: "BeanThere Free WiFi", lock: false, bars: 4 },
      { name: "BeanThere_Guest", lock: true, bars: 3 },
      { name: "BeanThere_Guest_5G", lock: false, bars: 4 },
      { name: "HP-Print-3F", lock: true, bars: 1 } ] },
  evidence: [
    { t: "Several networks with near-identical names", k: true, why: "Attackers create look-alike networks (\"evil twins\") next to the real one." },
    { t: "The posted network needs a password, but the look-alikes are open", k: true, why: "The café told you which network is theirs. Open look-alikes weren't set up by them." },
    { t: "The open networks have the strongest signal", k: false, why: "Signal strength isn't a trust signal. An attacker's hotspot can sit two tables away." },
    { t: "A printer network is visible", k: false, why: "Unrelated. Neighboring networks are normal." }
  ],
  responses: [
    { t: "Join \"BeanThere Free WiFi\" but skip banking sites.", p: 10, out: "An evil twin can still capture your logins, redirect pages and read unencrypted traffic, not only banking." },
    { t: "Join the posted network with the receipt password and turn on the company VPN.", p: 40, out: "You're on the real network, and the VPN encrypts everything on top of it." },
    { t: "Use your phone's personal hotspot instead.", p: 40, out: "Your own hotspot avoids shared Wi-Fi entirely. Also a great call." },
    { t: "Join the open network with the best signal.", p: 0, out: "It's the attacker's laptop. Your traffic flows through their machine for the next hour." }
  ],
  debrief: { name: "Evil-twin Wi-Fi", lesson: "Confirm the exact network name with staff, prefer password-protected networks, and use a VPN or your own hotspot on public Wi-Fi.",
    dos: ["Ask staff or check signage for the real network name", "Use a VPN on public networks", "Use your hotspot for sensitive work"],
    donts: ["Pick networks by signal strength or \"Free\" in the name", "Turn on auto-join for public networks"] } },

{ id: "t2", day: 1, time: "8:25 AM", area: "network", level: 2, attack: true,
  view: { type: "browser", url: "https://mail.halcyonfreight.com", tab: "Privacy error",
    page: "<div class=\"bw-cert\"><p class=\"bw-big2\">Your connection is not private</p><p>Attackers might be trying to steal your information from <b>mail.halcyonfreight.com</b> (for example, passwords, messages, or credit cards).</p><p class=\"bw-mono\">NET::ERR_CERT_AUTHORITY_INVALID</p><p class=\"bw-mono\">Certificate issued to: <b>secure-wifi-gateway.local</b></p><p class=\"bw-fine\">You're still on the café Wi-Fi. Company webmail opened normally yesterday at the office.</p><div class=\"bw-btns\"><span class=\"bw-btn\">Back to safety</span><span class=\"bw-link\">Advanced › Proceed anyway (unsafe)</span></div></div>" },
  evidence: [
    { t: "A certificate warning on a site that normally works", k: true, why: "When a familiar site suddenly throws a certificate error, something between you and it has changed." },
    { t: "You're on public Wi-Fi", k: true, why: "Public networks are where man-in-the-middle attacks happen most." },
    { t: "Certificate is issued to a different name than the site", k: true, why: "The certificate belongs to \"secure-wifi-gateway.local,\" not Halcyon. Someone is intercepting." },
    { t: "The page underneath would probably look normal", k: false, why: "A MITM attacker can show a perfect copy of the real page. Looks prove nothing." }
  ],
  responses: [
    { t: "Click Advanced › Proceed. You need your email.", p: 0, out: "The page loads fine, but everything you type, including your password, passes through the attacker's device." },
    { t: "Try a different browser.", p: 5, out: "The new browser shows the same warning. The problem is the network, not the browser." },
    { t: "Go back, disconnect, switch to your hotspot or VPN, and tell IT.", p: 40, out: "Over your hotspot the site loads with a valid certificate. IT logs the café network as hostile." }
  ],
  debrief: { name: "Man-in-the-middle (MITM)", lesson: "Certificate warnings are your browser telling you someone may be intercepting. On a site you use daily, treat one as an alarm, not a speed bump.",
    dos: ["Back out of certificate warnings on known sites", "Switch networks and report it"],
    donts: ["Click through \"Proceed anyway\"", "Enter credentials after a certificate warning"] } },

{ id: "t3", day: 1, time: "9:45 AM", area: "email", level: 2, attack: true,
  view: { type: "email", fromName: "Mark Ellison (CFO)", fromAddr: "m.ellison@halcyonfreight.co", to: "you@halcyonfreight.com",
    subject: "Urgent wire, confidential",
    body: "<p>Hi,</p><p>I need you to process a wire today for a new logistics vendor we're bringing on as part of a confidential deal. Amount: <b>$48,600.00</b>. Banking details attached. They changed banks last week, so use these, not what's on file.</p><p>I'm in board meetings all afternoon so please don't call. Just email me when it's done. This is time-sensitive and should stay between us until the announcement.</p><p>Thanks,<br>Mark Ellison<br>Chief Financial Officer | Halcyon Freight Co.</p>",
    attach: ["Vendor_Bank_Details.pdf"] },
  evidence: [
    { t: "Domain ends in .co, not .com", k: true, why: "One missing letter. Business email compromise often uses domains that differ by a single character." },
    { t: "\"Don't call\" and \"keep it between us\"", k: true, why: "Secrecy and blocking verification are the core of BEC. The attacker can't survive a phone call." },
    { t: "New bank details that override what's on file", k: true, why: "Changed payment details are the single biggest wire-fraud signal." },
    { t: "Skips the normal approval process", k: true, why: "Real executives don't route big payments around controls to a new hire." },
    { t: "The signature block looks correct", k: false, why: "Signatures are copied from real emails. They prove nothing." }
  ],
  responses: [
    { t: "Wait until his meetings end, then process it.", p: 10, out: "Delay alone doesn't verify anything. When you process it at 5 p.m., the money still goes to the attacker." },
    { t: "Call Mark at his number in the company directory, and report the email to Finance and Security.", p: 40, out: "Mark has no idea what you're talking about. Security blocks the domain, and you just saved $48,600." },
    { t: "Reply asking him to confirm the amount.", p: 5, out: "\"Confirmed, please hurry.\" Replying reaches the attacker, not Mark." },
    { t: "Send the wire. He's the CFO.", p: 0, out: "The money is gone in hours and is very hard to recover. BEC causes billions in losses each year." }
  ],
  debrief: { name: "Business email compromise (BEC)", lesson: "Any payment request involving urgency, secrecy or new bank details must be verified by calling a known number, no matter who appears to be asking.",
    dos: ["Call back using a directory number", "Follow approval steps every time", "Check domains letter by letter"],
    donts: ["Let rank or urgency override process", "Use contact info provided in the request"] } },

{ id: "t4", day: 1, time: "11:00 AM", area: "phone", level: 2, attack: true,
  view: { type: "call", callerName: "Meridian Federal CU", callerNum: "(800) 555-0110", label: "Incoming call · transcript", lines: [
    { who: "Caller", text: "Hi, this is Alex from Meridian Federal's fraud department. We've flagged a $1,240 charge at an electronics store in Ohio. Did you make this purchase?" },
    { who: "You", text: "No, I didn't." },
    { who: "Caller", text: "Okay, I can block it right now. For security, I just texted you a verification code. Can you read it back to me? Please hurry, the merchant is trying to finalize in the next few minutes." },
    { who: "Text on your screen", text: "Meridian Federal: Your code is 774019. Never share this code. We will never call to ask for it." } ] },
  evidence: [
    { t: "Caller ID shows your bank's name", k: false, why: "Caller ID is easily faked (spoofed). It is not proof of who's calling." },
    { t: "They want the code that says never to share it", k: true, why: "The bank's own message says they'll never ask. That's the giveaway." },
    { t: "Time pressure: \"the next few minutes\"", k: true, why: "Urgency keeps you from hanging up and checking." },
    { t: "They called you, not the other way around", k: true, why: "When someone calls you about your account, you can't confirm who they are." },
    { t: "They knew which bank you use", k: false, why: "That's often guessed or found in leaked data. It isn't proof." }
  ],
  responses: [
    { t: "Hang up, then call the number on the back of your card.", p: 40, out: "The real fraud team says there's no flagged charge. Someone was trying to log in as you, and they lock the account." },
    { t: "Ask them to confirm your home address first.", p: 5, out: "They read it off perfectly. Data breaches make personal details easy to buy." },
    { t: "Read them the code to stop the charge.", p: 0, out: "The code finishes a login to your online banking. Your savings move to another account." },
    { t: "Stay on the line but refuse to give the code.", p: 20, out: "You kept the code safe, but they keep you talking and try other angles. Hanging up and calling back is stronger." }
  ],
  debrief: { name: "Vishing (voice phishing) with spoofed caller ID", lesson: "Banks don't call to ask for codes. Hang up and call the number on your card, every time.",
    dos: ["Hang up and call back on a number you trust", "Read what security texts actually say"],
    donts: ["Trust caller ID", "Share one-time codes with anyone"] } },

{ id: "t5", day: 1, time: "1:30 PM", area: "ai", level: 2, attack: true,
  view: { type: "call", callerName: "Priya Shah (Manager)", callerNum: "Unknown number", label: "Voicemail · 0:38 · transcript", lines: [
    { who: "Voicemail", text: "Hey, it's Priya. I'm stuck at the client site and my phone's about to die, so this is a borrowed one. I need a favor. Can you grab five $200 gift cards from the pharmacy downstairs? They're thank-yous for the client team. Text photos of the backs with the codes to this number and I'll reimburse you today. Thanks, you're a lifesaver." },
    { who: "Note", text: "It sounds exactly like Priya: her voice, her laugh, the way she says \"lifesaver.\" She spoke at a public conference last month, and the video is online." } ] },
  evidence: [
    { t: "Asks for gift cards and photos of the codes", k: true, why: "Gift cards are a scammer favorite because they're fast and nearly untraceable. No real business pays this way." },
    { t: "The voice sounds exactly like her", k: false, why: "AI can clone a voice from a short public clip. A perfect match is no longer proof." },
    { t: "Calling from an unknown \"borrowed\" phone", k: true, why: "An excuse for why you can't reach her the normal way blocks verification." },
    { t: "Urgency and a reason she can't talk", k: true, why: "\"Phone's about to die\" keeps you from calling back." },
    { t: "Promises fast reimbursement", k: true, why: "Reassurance about getting your money back is a common push." }
  ],
  responses: [
    { t: "Text the number back to ask a few questions.", p: 10, out: "The \"borrowed phone\" answers instantly with convincing details. You're still talking to the scammer." },
    { t: "Buy the cards. It's definitely her voice.", p: 0, out: "$1,000 drained in minutes. The real Priya was in a meeting the whole time." },
    { t: "Contact Priya on her known number or in Halcyon Chat, and report the voicemail.", p: 40, out: "Priya replies within a minute: \"Not me!\" Security sends a team-wide alert about the voice clone." },
    { t: "Ask a coworker if Priya does this kind of thing.", p: 20, out: "Your coworker is suspicious too, which helps, but neither of you checked with Priya herself." }
  ],
  debrief: { name: "AI voice-clone impersonation", lesson: "A familiar voice is no longer proof of identity. Verify unusual requests through a channel you already trust, and consider a family or team code word.",
    dos: ["Call the person back on a number you already have", "Agree on a code word for urgent money requests"],
    donts: ["Pay with gift cards for work or emergencies", "Treat a voice match as verification"] } },

{ id: "t6", day: 1, time: "3:00 PM", area: "devices", level: 2, attack: true,
  view: { type: "sms", contact: "Halcyon SSO", messages: [
    { from: "sys", text: "Approve sign-in? Halcyon SSO · Bucharest, RO · Windows PC" },
    { from: "sys", text: "Approve sign-in? Halcyon SSO · Bucharest, RO · Windows PC" },
    { from: "sys", text: "Approve sign-in? (6 requests in 4 minutes)" },
    { from: "them", text: "(305) 555-0199: Hi, this is Halcyon IT. We're fixing a sync glitch on your account. Just approve the prompt to make the notifications stop." } ] },
  evidence: [
    { t: "Sign-in prompts you didn't start", k: true, why: "If you aren't logging in, someone else is, and they already have your password." },
    { t: "Unfamiliar location", k: true, why: "You're in Miami. A login from Bucharest isn't you." },
    { t: "Repeated prompts in quick succession", k: true, why: "This is \"MFA fatigue\": spamming prompts until you tap Approve to make it stop." },
    { t: "A text pressuring you to approve", k: true, why: "Attackers often follow up posing as IT to make approving seem normal." }
  ],
  responses: [
    { t: "Approve so the notifications stop.", p: 0, out: "That tap let the attacker into your account. Within minutes they're forwarding your email." },
    { t: "Deny every prompt and wait for it to stop.", p: 15, out: "Good instinct, but the attacker still has your password and will keep trying." },
    { t: "Deny, report to IT right away, and change your password.", p: 40, out: "IT resets your session and password. With the password changed, the attacker's attempts stop working." },
    { t: "Turn off your phone.", p: 5, out: "The prompts stop reaching you, but nothing is fixed and nobody knows." }
  ],
  debrief: { name: "MFA fatigue (push bombing)", lesson: "An approval prompt you didn't trigger means your password is already stolen. Deny it, report it and change your password.",
    dos: ["Deny unexpected prompts", "Report and reset your password right away"],
    donts: ["Approve prompts to make them stop", "Trust \"IT\" texts telling you to approve"] } },

{ id: "t7", day: 1, time: "4:45 PM", area: "physical", level: 1, attack: true,
  view: { type: "scene", place: "Employee parking lot",
    narration: ["Walking to your car, you spot a brand-new USB drive near the curb. Someone has written on it in marker:"],
    lines: [{ who: "Label on the drive", text: "Q4 LAYOFFS – CONFIDENTIAL" }] },
  evidence: [
    { t: "A tempting, emotional label", k: true, why: "\"Layoffs,\" \"salaries\" and \"confidential\" labels are designed to make you curious enough to plug it in." },
    { t: "Found in a public place near the building", k: true, why: "USB drops are planted where employees will find them." },
    { t: "It looks brand new", k: false, why: "New or worn, the risk is the same." }
  ],
  responses: [
    { t: "Plug it into your work laptop to find the owner.", p: 0, out: "The drive acts like a keyboard and types commands in seconds. Malware is now on the company network." },
    { t: "Take it home and check it on your personal computer.", p: 0, out: "Your home PC is infected, and the next time you log into work from it, so is your work account." },
    { t: "Hand it to IT or Security without plugging it in.", p: 40, out: "Security analyzes it in an isolated lab. It's a planted test, and you passed." },
    { t: "Throw it in the trash.", p: 20, out: "Safe for you, but someone else might find it, and Security never learns about a possible targeted attack." }
  ],
  debrief: { name: "USB drop (baiting)", lesson: "Unknown drives can attack a computer the moment they're plugged in. Curiosity is the bait. Hand them to IT.",
    dos: ["Give found drives to IT or Security", "Use only company-issued storage"],
    donts: ["Plug in unknown USB devices, even \"just to look\""] } },

/* ───────── WEDNESDAY ───────── */
{ id: "w1", day: 2, time: "9:00 AM", area: "email", level: 1, attack: false,
  view: { type: "email", fromName: "Jamal Okafor", fromAddr: "j.okafor@halcyonfreight.com", to: "Dispatch Team", subject: "Invitation: Dispatch weekly standup (Wednesdays 9:30)",
    body: "<p>Adding you to our weekly standup, as Priya mentioned on Monday. Same room as always (3B), or join from Halcyon Chat if you're remote.</p><p>No prep needed. Just bring your questions.</p><p>– Jamal</p><p class=\"cal\">📅 Wed 9:30–9:50 AM · Conference Room 3B · Organizer: j.okafor@halcyonfreight.com</p>" },
  evidence: [
    { t: "Sent from a known teammate on the company domain", k: true, why: "The sender and domain both match someone you've met." },
    { t: "Matches what your manager told you", k: true, why: "Priya said this was coming. Expected messages are lower risk." },
    { t: "No links, attachments or requests for information", k: true, why: "There's nothing here an attacker could use against you." },
    { t: "It's short and informal", k: false, why: "Style isn't evidence either way." }
  ],
  responses: [
    { t: "Accept the invite.", p: 40, out: "You're in the standup and meet the rest of dispatch. Normal work, handled normally." },
    { t: "Report it as phishing.", p: 10, out: "IT clears it. Over-reporting is better than under-reporting, but this one had every trust signal." },
    { t: "Ignore it.", p: 15, out: "You miss the standup and Priya asks where you were." }
  ],
  debrief: { name: "Legitimate email", lesson: "An expected message from a known colleague, with nothing risky inside, is just work. Recognizing safe mail keeps your reports meaningful.",
    dos: ["Weigh sender, context and the request together"],
    donts: ["Report every message by reflex"] } },

{ id: "w2", day: 2, time: "10:20 AM", area: "ai", level: 3, attack: true,
  view: { type: "email", fromName: "Jordan Blake", fromAddr: "jordan.blake@vantage-logistics-talent.com", to: "you@halcyonfreight.com",
    subject: "Congrats on the Halcyon role, quick resource for you",
    body: "<p>Hi there,</p><p>I saw your post last week about starting as a Dispatch Coordinator at Halcyon Freight. Congratulations! Your point about route-planning tools was spot on.</p><p>Our team just published the 2026 Freight Operations Salary Benchmark, and I thought it might be useful as you settle in. It covers coordinator pay bands across 40 carriers.</p><p><span class=\"lnk\" data-href=\"https://clouddocs-share.net/view/benchmark-2026?login=work\">View the report on CloudDocs</span></p><p>You'll be asked to sign in with your work email to view it. That keeps the report limited to industry professionals.</p><p>Best,<br>Jordan Blake<br>Senior Talent Partner, Vantage Logistics</p>" },
  evidence: [
    { t: "Flawless grammar and a professional tone", k: false, why: "AI tools now write perfect phishing. Good writing is no longer a sign of safety." },
    { t: "Uses details from your public social media post", k: true, why: "Personal details make a message feel real. This is spear phishing, built from what you shared." },
    { t: "Wants you to sign in with your work credentials to view a document", k: true, why: "A public report doesn't need your work password. This is credential harvesting." },
    { t: "Link goes to clouddocs-share.net, not the real service", k: true, why: "A look-alike domain hosting a fake login page." },
    { t: "Unsolicited contact from a stranger", k: true, why: "You never asked for this report." }
  ],
  responses: [
    { t: "Sign in. It's a useful report.", p: 0, out: "The \"report\" page captures your work email and password. The attacker now has a foothold in Halcyon." },
    { t: "Open it on your personal phone instead.", p: 5, out: "Same fake login page, different device. Your credentials are still the target." },
    { t: "Reply asking them to attach a PDF instead.", p: 10, out: "They happily send a PDF, with a malicious link inside. Engaging gives them another try." },
    { t: "Don't click. Report it as phishing.", p: 40, out: "Security finds three other new hires got the same email after posting about their jobs." }
  ],
  debrief: { name: "AI-assisted spear phishing", lesson: "Polished writing and personal details are now cheap for attackers. Judge the request, not the polish. A document that wants your work password is a trap.",
    dos: ["Be careful what job details you post publicly", "Treat \"sign in to view\" links from strangers as phishing"],
    donts: ["Use perfect grammar as proof of legitimacy", "Enter work credentials on sites reached from emails"] } },

{ id: "w3", day: 2, time: "11:30 AM", area: "physical", level: 2, attack: true,
  view: { type: "scene", place: "Hallway outside the server room, 2nd floor",
    narration: ["A man in a hi-vis vest with a clipboard and a tool bag stops you near the locked server room."],
    lines: [
      { who: "Man in vest", text: "Hey, IT sent me to check a switch in there. My contractor badge isn't activated yet, it's my first day on this account. Could you badge me in? I'll be ten minutes, tops." } ] },
  evidence: [
    { t: "Asks you to use your badge for him", k: true, why: "Badges are tied to you. Letting someone in under your badge makes you responsible for what they do." },
    { t: "Name-drops IT without any proof", k: true, why: "\"IT sent me\" is easy to say. Real work orders come with an escort or ticket you can check." },
    { t: "Hi-vis vest, clipboard and tools", k: false, why: "Props are cheap. They make people look like they belong." },
    { t: "Says his badge \"isn't activated yet\"", k: true, why: "A ready-made excuse for why normal access doesn't work." },
    { t: "He wants into the server room", k: true, why: "High-value areas deserve extra care, not less." }
  ],
  responses: [
    { t: "Ask to see his contractor ID, then let him in.", p: 10, out: "He shows a laminated card. ID cards are easy to fake, and you still can't verify the work order." },
    { t: "Call the IT Service Desk to confirm, and let IT escort him.", p: 40, out: "There's no ticket. Security meets him in the hallway, and he leaves quickly." },
    { t: "Badge him in. He has the gear and knows about the switch.", p: 0, out: "Ten minutes later a small device is plugged into the network, quietly sending data outside." },
    { t: "Tell him to wait while you find your manager.", p: 25, out: "A good stall, and he \"remembers another appointment.\" Calling IT directly would have gotten Security involved." }
  ],
  debrief: { name: "Pretexting / impersonation for physical access", lesson: "Uniforms and confident stories are easy to fake. Never lend your badge. Verify with the department that supposedly sent them.",
    dos: ["Verify work orders with IT or Facilities directly", "Let authorized staff escort contractors"],
    donts: ["Badge anyone else into a restricted area", "Accept props or ID cards as proof"] } },

{ id: "w4", day: 2, time: "1:15 PM", area: "phone", level: 2, attack: true,
  view: { type: "scene", place: "Your car, employee lot",
    narration: ["There's a bright orange notice tucked under your windshield wiper."],
    lines: [
      { who: "Notice", text: "PARKING VIOLATION. Unpaid parking detected. Pay $35 within 24 hours to avoid a $150 penalty and towing. Scan to pay: [QR code]" },
      { who: "You notice", text: "The QR code is a sticker, slightly crooked. There's no citation number, officer name or city seal. You parked in your assigned employee spot." } ] },
  evidence: [
    { t: "Pay-by-QR with no other official details", k: true, why: "A QR code hides its destination until you scan it. \"Quishing\" relies on that." },
    { t: "The QR code is a sticker", k: true, why: "Stickers are a classic sign someone covered or added a code." },
    { t: "No citation number, officer or agency seal", k: true, why: "Real citations identify the agency and the violation." },
    { t: "Threat of towing and a bigger fine", k: true, why: "Urgency again, pushing you to pay before thinking." },
    { t: "Bright orange paper", k: false, why: "Color tells you nothing." }
  ],
  responses: [
    { t: "Scan and pay. $35 beats $150.", p: 0, out: "The payment page steals your card number and saves it for future charges." },
    { t: "Scan it just to see where it goes.", p: 5, out: "Scanning alone can land you on a malicious page or a fake login. Curiosity is the hook." },
    { t: "Don't scan. Look up the city's parking site yourself, and show the notice to building security.", p: 40, out: "The city has no record of a ticket. Security finds the same notice on 30 cars and alerts staff." },
    { t: "Throw it away.", p: 20, out: "You're safe, but other employees might pay. Reporting protects them." }
  ],
  debrief: { name: "Quishing (QR-code phishing)", lesson: "A QR code is just a hidden link. Check payment requests through official sites you look up yourself.",
    dos: ["Look up official payment sites manually", "Report suspicious notices to security"],
    donts: ["Scan QR codes on unexpected notices, flyers or stickers"] } },

{ id: "w5", day: 2, time: "2:40 PM", area: "ai", level: 3, attack: true,
  view: { type: "video", title: "Project Atlas – Confidential", tiles: ["Mark Ellison (CFO)", "Sara Lin (Legal)", "Tom Reyes (Finance)", "You"],
    lines: [
      { who: "Mark (on video)", text: "Thanks for joining on short notice. We're closing an acquisition today and need $250,000 moved to the escrow account in the chat. Legal has signed off. This stays confidential until the press release." },
      { who: "You notice", text: "The invite came from an outside calendar, not the company one. Mark's mouth is slightly out of sync with his voice. When you ask Tom how his trip went, he says \"Let's stay focused\" and his face barely moves." } ] },
  evidence: [
    { t: "Several familiar faces are on the call", k: false, why: "Deepfakes can show multiple people. In a real 2024 case, an employee paid $25 million after a call where everyone else was fake." },
    { t: "Large, secret, same-day transfer", k: true, why: "Secrecy plus urgency plus money is the BEC formula, now on video." },
    { t: "Meeting came from outside normal channels", k: true, why: "Real internal meetings come through the company calendar." },
    { t: "Lip-sync glitches and stiff faces", k: true, why: "Deepfake video often struggles with natural movement and timing." },
    { t: "Dodges unscripted small talk", k: true, why: "Live deepfakes handle off-script questions poorly." }
  ],
  responses: [
    { t: "Process it. The CFO and Legal are right there.", p: 0, out: "The money is gone. None of those people were real." },
    { t: "Ask a question only the real Mark would know.", p: 20, out: "He deflects smoothly. A good test, but you still need independent verification before moving money." },
    { t: "Leave the call, phone Mark on his directory number, and follow the two-person approval process.", p: 40, out: "Mark was at lunch and never heard of Project Atlas. Security begins an investigation." }
  ],
  debrief: { name: "Deepfake video-call fraud", lesson: "Seeing someone on video is no longer proof. Big or unusual payments must be confirmed out-of-band and pass normal approvals, no exceptions.",
    dos: ["Verify by calling a directory number", "Insist on normal approval steps"],
    donts: ["Trust faces and voices alone", "Move money because a meeting feels official"] } },

{ id: "w6", day: 2, time: "4:00 PM", area: "devices", level: 2, attack: true,
  view: { type: "browser", url: "https://freighttrendsdaily.com/fuel-prices", tab: "Fuel prices this week",
    page: "<div class=\"bw-update\"><p class=\"bw-big2\">Your browser is out of date</p><p>A critical security update is required to keep viewing this site. Version 118 fixes 14 vulnerabilities.</p><div class=\"bw-btns\"><span class=\"bw-btn\">Download BrowserUpdate_v118.exe</span></div><p class=\"bw-fine\">This banner appeared on a trade-news site you were reading on your lunch break.</p></div>" },
  evidence: [
    { t: "A website, not your browser, is offering the update", k: true, why: "Browsers update themselves through their own settings, never through a random site." },
    { t: "Downloads an .exe file", k: true, why: "An executable file from a web page can install anything." },
    { t: "Claims you must update to keep reading", k: true, why: "Blocking content until you act is a pressure tactic." },
    { t: "The banner looks professional", k: false, why: "Design quality says nothing about safety." }
  ],
  responses: [
    { t: "Download it, but scan it with antivirus first.", p: 5, out: "New malware often isn't detected yet. Scanning doesn't make an untrusted download safe." },
    { t: "Close the banner and check for updates in your browser's own settings menu.", p: 40, out: "Your browser is already current. You tell IT about the site's fake banner." },
    { t: "Download and run it.", p: 0, out: "The \"update\" installs an info-stealer that copies your saved passwords." }
  ],
  debrief: { name: "Fake software update (malvertising)", lesson: "Updates come from the software itself or IT, never from a pop-up on a website.",
    dos: ["Update through official settings or IT tools", "Report sites showing fake updates"],
    donts: ["Download updates from web pages", "Rely on a scan to clear an untrusted file"] } },

/* ───────── THURSDAY ───────── */
{ id: "h1", day: 3, time: "8:30 AM", area: "email", level: 2, attack: true,
  view: { type: "email", fromName: "Riverside Supply Billing", fromAddr: "billing@riversidesupp1y.com", to: "you@halcyonfreight.com",
    subject: "RE: Invoice #44871, updated copy",
    body: "<p>Hello,</p><p>Following up on invoice #44871 from last month. Our system generated an incorrect total, so please use the corrected copy attached.</p><p>If the document shows as protected, click <b>Enable Editing</b> to view.</p><p>Kind regards,<br>Riverside Supply Accounts Receivable</p>",
    attach: ["Invoice_44871_Riverside.pdf.html"] },
  evidence: [
    { t: "Domain spells \"supp1y\" with the number 1", k: true, why: "A character swap that's easy to miss at a glance." },
    { t: "Attachment has a double extension (.pdf.html)", k: true, why: "It looks like a PDF but is actually a web page that can show a fake login." },
    { t: "It references a real past invoice number", k: false, why: "That makes it convincing, but attackers get these details from hacked vendor mailboxes. It isn't proof of safety." },
    { t: "Asks you to click \"Enable Editing\"", k: true, why: "Enabling editing or macros is how many malicious documents run their code." },
    { t: "Polite, routine wording", k: false, why: "Routine tone helps it blend in. It isn't evidence." }
  ],
  responses: [
    { t: "Delete it.", p: 20, out: "You're safe, but Accounts Payable and Riverside never learn that Riverside may be hacked." },
    { t: "Open the attachment to check the total.", p: 0, out: "It opens a fake email login page in your browser. One password later, the attacker is in." },
    { t: "Call Riverside using the contact in the vendor file, and report the email to Security.", p: 40, out: "Riverside confirms their mailbox was hacked last week. Security blocks the look-alike domain." }
  ],
  debrief: { name: "Malicious attachment / vendor impersonation", lesson: "Check file extensions and sender spelling carefully. Real context, like an invoice number, can come from a hacked vendor.",
    dos: ["Verify vendor changes using contact info already on file", "Turn on file extensions in your file viewer"],
    donts: ["Open unexpected attachments", "Click \"Enable Editing\" or enable macros on emailed files"] } },

{ id: "h2", day: 3, time: "9:40 AM", area: "phone", level: 1, attack: false,
  view: { type: "sms", contact: "72554 (Halcyon Payroll)", messages: [
    { from: "me", text: "(You just typed your password into the payroll portal you opened from the intranet.)" },
    { from: "them", text: "Halcyon Payroll: Your sign-in code is 482911. It expires in 5 minutes. Never share this code with anyone." } ] },
  evidence: [
    { t: "You just requested it by signing in", k: true, why: "A code that arrives right after you start a login is expected." },
    { t: "Contains no link and doesn't ask you to reply", k: true, why: "It only delivers the code and warns you not to share it." },
    { t: "From the same short code as earlier payroll messages", k: true, why: "Consistent with past real messages." },
    { t: "It has a 5-minute expiration", k: false, why: "Normal for codes, but expiration alone doesn't tell you it's real." }
  ],
  responses: [
    { t: "Type the code into the payroll portal you opened.", p: 40, out: "You're in and your direct deposit is set up. This is MFA working as intended." },
    { t: "Forward the code to IT to ask if it's legit.", p: 5, out: "Never send codes to anyone, even IT. Codes go only into the login page you started." },
    { t: "Report the text as a scam.", p: 10, out: "It was real. Knowing when you started a login is how you tell real codes from fake ones." }
  ],
  debrief: { name: "Legitimate MFA code", lesson: "A code you asked for, entered only on the page you opened, is safe. A code you didn't ask for, or one someone wants you to read back, is not.",
    dos: ["Enter codes only into the login you started"],
    donts: ["Send codes to anyone, ever"] } },

{ id: "h3", day: 3, time: "11:00 AM", area: "phone", level: 2, attack: true,
  view: { type: "chat", app: "LinkedUp (professional network)", channel: "Message request", messages: [
    { who: "Taylor Morgan · Industry Research Analyst", text: "Hi! I'm surveying logistics professionals for an industry report. It's 3 quick questions, and I'll send a $50 gift card as thanks." },
    { who: "Taylor Morgan · Industry Research Analyst", text: "1) What software does Halcyon use for payroll? 2) Which VPN do remote staff connect with? 3) Who handles IT vendor contracts there?" } ] },
  evidence: [
    { t: "Asks about internal systems and people", k: true, why: "Payroll software, VPN vendor and IT contacts are exactly what attackers need to plan a targeted attack." },
    { t: "Offers a reward for answering", k: true, why: "Incentives lower your guard." },
    { t: "Stranger contacting you out of nowhere", k: true, why: "No relationship and no way to verify who they are." },
    { t: "Professional profile photo and job title", k: false, why: "Profiles, photos and titles are easy to fake, or generate with AI." }
  ],
  responses: [
    { t: "Answer. It's harmless public info.", p: 0, out: "Two weeks later, payroll staff get phishing emails that perfectly mimic your payroll vendor, and the VPN vendor gets probed." },
    { t: "Answer vaguely, without names.", p: 10, out: "Even vague answers help an attacker narrow their plan. The safe amount to share is nothing." },
    { t: "Ignore the message.", p: 20, out: "Safe for you, but the same person keeps targeting your coworkers." },
    { t: "Decline politely and report the profile to Halcyon Security.", p: 40, out: "Security warns staff about the \"researcher,\" and the platform removes the fake profile." }
  ],
  debrief: { name: "Reconnaissance / pretexting", lesson: "Attacks often start with harmless-seeming questions. Details about systems, vendors and people inside your company are not for strangers.",
    dos: ["Send outside questions about company systems to Security or PR"],
    donts: ["Share internal tools, vendors or org details with unknown contacts"] } },

{ id: "h4", day: 3, time: "1:00 PM", area: "network", level: 3, attack: true,
  view: { type: "browser", url: "http://192.168.10.1/portal", tab: "Harbor Inn Guest Wi-Fi",
    page: "<div class=\"bw-portal\"><p class=\"bw-big2\">Welcome to Harbor Inn</p><p>To protect guests, our network requires a security certificate. Install the <b>Harbor Inn Secure Profile</b> to continue to the internet.</p><div class=\"bw-btns\"><span class=\"bw-btn\">Install Secure Profile</span></div><p class=\"bw-fine\">You're at a hotel for a client visit. The front desk gave you a room-number login, but this page appeared after you connected.</p></div>" },
  evidence: [
    { t: "Asks you to install a certificate or profile", k: true, why: "Installing a root certificate lets whoever controls it read and change your encrypted (HTTPS) traffic." },
    { t: "Frames the request as \"protecting guests\"", k: true, why: "Security language is used to make a dangerous step sound responsible." },
    { t: "The page uses the hotel's name and branding", k: false, why: "Branding is easy to copy, and anyone on the network can serve a fake portal." },
    { t: "The front desk only mentioned a room-number login", k: true, why: "Instructions that don't match what staff told you are a red flag." }
  ],
  responses: [
    { t: "Install it. It's the hotel's own portal.", p: 0, out: "Every site you visit now passes through the attacker's certificate, invisibly, with no warnings." },
    { t: "Install it, then remove it when you check out.", p: 5, out: "Everything you do until checkout is exposed. Removing it later doesn't undo that." },
    { t: "Don't install. Use your phone's hotspot or VPN, and mention it to the front desk.", p: 40, out: "The front desk has never heard of a \"secure profile.\" They call their IT vendor." }
  ],
  debrief: { name: "Man-in-the-middle via rogue certificate", lesson: "No legitimate public Wi-Fi requires you to install a certificate or profile. Doing so hands over your encrypted traffic.",
    dos: ["Use a hotspot or VPN when traveling", "Check unusual portal steps with staff"],
    donts: ["Install certificates or profiles from captive portals"] } },

{ id: "h5", day: 3, time: "3:20 PM", area: "email", level: 1, attack: false,
  view: { type: "email", fromName: "Halcyon IT Service Desk", fromAddr: "itservicedesk@halcyonfreight.com", to: "All Staff", subject: "Scheduled maintenance: Saturday 10 PM – 2 AM",
    body: "<p>Hello all,</p><p>Email and file shares will be briefly unavailable Saturday night from 10 PM to 2 AM Eastern for routine server maintenance.</p><p><b>No action is needed.</b> Save your work before you log off Friday.</p><p>This notice is also posted on the intranet home page under IT Announcements.</p><p>– Halcyon IT Service Desk</p>" },
  evidence: [
    { t: "Correct company domain and known IT mailbox", k: true, why: "Matches the real service desk address." },
    { t: "No links, attachments or requests", k: true, why: "Nothing to click and nothing to give. That's low risk." },
    { t: "Confirmed by a notice on the intranet", k: true, why: "A second, trusted source says the same thing." },
    { t: "Sent to all staff", k: false, why: "Mass emails can be either real or phishing." }
  ],
  responses: [
    { t: "Note it and plan to save your work Friday.", p: 40, out: "Monday morning, everything works. Safe email handled correctly." },
    { t: "Report it as phishing.", p: 15, out: "IT confirms it's real. Checking the intranet yourself would have answered the question." },
    { t: "Reply to ask IT if it's real.", p: 10, out: "IT says yes. Checking a trusted second source is quicker than replying." }
  ],
  debrief: { name: "Legitimate announcement", lesson: "When unsure, confirm through a second trusted source like the intranet. Messages that ask for nothing are rarely dangerous.",
    dos: ["Cross-check announcements on the intranet"],
    donts: ["Panic over messages that ask for nothing"] } },

{ id: "h6", day: 3, time: "5:40 PM", area: "physical", level: 2, attack: true,
  view: { type: "scene", place: "Commuter train, ride home",
    narration: ["You're finishing a payroll reconciliation spreadsheet on your laptop: names, salaries, bank routing numbers.",
      "The man standing behind your seat keeps glancing down. You notice his phone is angled toward your screen."],
    lines: [] },
  evidence: [
    { t: "Sensitive personal and financial data is on screen", k: true, why: "Payroll data is valuable to identity thieves." },
    { t: "Your screen is visible to strangers", k: true, why: "Shoulder surfing needs only a line of sight." },
    { t: "His phone is angled toward your screen", k: true, why: "A camera can capture a whole screen in one frame." },
    { t: "The train is crowded", k: false, why: "Crowding makes it easier, but it's the visibility of the data that matters." }
  ],
  responses: [
    { t: "Keep working. He's probably just reading his phone.", p: 0, out: "A clear photo of 40 employees' bank details ends up for sale online." },
    { t: "Tilt your screen away a little.", p: 10, out: "Better, but at an angle the screen is still readable from behind." },
    { t: "Close the laptop, finish in private, and tell your manager if you think data was captured.", p: 40, out: "You finish at home with a privacy screen. Your manager appreciates the heads-up and logs it." }
  ],
  debrief: { name: "Shoulder surfing", lesson: "Sensitive work belongs in private spaces. Privacy screens help, and reporting a possible exposure lets the company respond.",
    dos: ["Use a privacy screen in public", "Save sensitive work for private spaces", "Report possible data exposure"],
    donts: ["Open payroll, health or customer data where others can see"] } },

/* ───────── FRIDAY ───────── */
{ id: "f1", day: 4, time: "9:00 AM", area: "ai", level: 3, attack: true,
  view: { type: "chat", app: "halcyon-benefits-enroll.com", channel: "Benefits Assistant (AI)", messages: [
    { who: "Context", text: "You searched \"Halcyon benefits enrollment\" and clicked the first result, a sponsored ad." },
    { who: "Benefits Assistant", text: "Hi! I'm Halcyon's AI benefits assistant. Open enrollment closes today. I can enroll you in under 2 minutes." },
    { who: "Benefits Assistant", text: "To confirm eligibility, please enter your full Social Security number, date of birth and your Halcyon password." } ] },
  evidence: [
    { t: "You reached it through a search ad", k: true, why: "Attackers buy ads that appear above real results. Navigate from the intranet instead." },
    { t: "Asks for your SSN, date of birth and password in a chat", k: true, why: "No legitimate system asks for all three in a chat. That's an identity-theft starter kit." },
    { t: "The domain isn't the company's", k: true, why: "halcyon-benefits-enroll.com is a look-alike." },
    { t: "A smooth, helpful AI assistant", k: false, why: "Building a convincing AI chatbot is now cheap. Polish proves nothing." },
    { t: "\"Closes today\" deadline", k: true, why: "Deadline pressure again." }
  ],
  responses: [
    { t: "Enter just the last four digits of your SSN.", p: 5, out: "Partial data still helps them, and they'll ask for the rest next." },
    { t: "Close the tab, open benefits from the intranet, and report the fake site to IT.", p: 40, out: "Enrollment actually closes next Friday. IT reports the ad and warns staff." },
    { t: "Enter the information. Enrollment closes today.", p: 0, out: "Your identity is stolen and your work account is compromised in one go." }
  ],
  debrief: { name: "AI chatbot impersonation via malicious ad", lesson: "Search ads can lead to perfect fakes. Reach company systems from bookmarks or the intranet, and never type passwords or SSNs into a chatbot.",
    dos: ["Navigate to work systems from the intranet", "Report fake sites and ads"],
    donts: ["Trust sponsored search results for logins", "Give personal data to chatbots"] } },

{ id: "f2", day: 4, time: "10:30 AM", area: "phone", level: 3, attack: true,
  view: { type: "sms", contact: "Your phone", messages: [
    { from: "them", text: "Carrier Notice: The SIM card for your number was changed at 10:12 AM. If you did not request this, call 1-877-555-0163 immediately." },
    { from: "sys", text: "Status bar: No Service. Your phone has had full signal all morning in the office." } ] },
  evidence: [
    { t: "Phone suddenly shows \"No Service\" where it usually works", k: true, why: "When your number moves to an attacker's SIM, your phone loses service." },
    { t: "A SIM change you didn't request", k: true, why: "This is how SIM swapping starts. The attacker now gets your calls and text codes." },
    { t: "The notice gives a number to call", k: true, why: "Even if the warning is real, call your carrier using a number you look up yourself, not one in the text." },
    { t: "The message is short", k: false, why: "Length isn't evidence." }
  ],
  responses: [
    { t: "Call the number in the text.", p: 5, out: "If the text was a trap, the \"agent\" walks you through giving up your account PIN." },
    { t: "Wait for the signal to come back.", p: 0, out: "While you wait, the attacker resets your bank and email passwords using text codes sent to their SIM." },
    { t: "From another phone, call your carrier's official number, lock your account, and alert your bank and IT.", p: 40, out: "The carrier reverses the swap and adds a port-out PIN. Your bank freezes transfers in time." }
  ],
  debrief: { name: "SIM swapping", lesson: "Unexpected loss of service plus a SIM-change notice is an emergency. Act fast through official channels, and use app-based MFA instead of SMS where you can.",
    dos: ["Set a carrier account PIN or port-out lock", "Prefer authenticator apps or security keys over SMS codes"],
    donts: ["Call numbers provided in the warning", "Wait it out"] } },

{ id: "f3", day: 4, time: "1:00 PM", area: "email", level: 2, attack: true,
  view: { type: "email", fromName: "Lena Park", fromAddr: "l.park@halcyonfreight.com", to: "you@halcyonfreight.com",
    subject: "Lena Park shared \"Halcyon_Bonus_Structure_2027.xlsx\" with you",
    body: "<p>Lena Park has shared a file with you.</p><p class=\"cal\">📄 Halcyon_Bonus_Structure_2027.xlsx</p><p><span class=\"lnk\" data-href=\"https://clouddocs-files.com/auth/login?file=bonus2027\">Open in CloudDocs</span></p><p class=\"fine\">You have never worked with Lena. She's in Accounting on another floor.</p>" },
  evidence: [
    { t: "It comes from a real coworker's company address", k: false, why: "Not a trust signal on its own. Lena's account may be compromised and sending to everyone." },
    { t: "An unexpected file from someone you don't work with", k: true, why: "Why would Accounting share a bonus file with a new dispatch hire?" },
    { t: "The link goes to a look-alike login page", k: true, why: "clouddocs-files.com is not the real file service." },
    { t: "A tempting file name about bonuses", k: true, why: "Money and confidential topics drive clicks." }
  ],
  responses: [
    { t: "Reply to Lena's email to ask if she meant to send it.", p: 10, out: "The attacker controls her inbox and replies, \"Yes, please review!\"" },
    { t: "Sign in to see the file.", p: 0, out: "Now two accounts are compromised: Lena's and yours." },
    { t: "Message Lena in Halcyon Chat or call her extension, and report the email.", p: 40, out: "Lena didn't send it. IT resets her account and pulls the email from 200 inboxes." },
    { t: "Ignore it.", p: 15, out: "You're safe, but Lena's account keeps spreading the attack." }
  ],
  debrief: { name: "Phishing from a compromised internal account", lesson: "A real sender address doesn't mean a real request. Unexpected shares deserve a quick check through another channel.",
    dos: ["Confirm unexpected shares by chat or phone", "Report suspicious internal emails"],
    donts: ["Reply to the suspicious email to verify it"] } },

{ id: "f4", day: 4, time: "3:30 PM", area: "physical", level: 2, attack: false,
  view: { type: "scene", place: "Dispatch office, 3rd floor",
    narration: ["Yesterday the office manager emailed everyone: \"An HVAC technician from CoolAir Services will be on 3 Friday afternoon to fix the AC.\"",
      "At 3:30 a technician arrives, escorted by Maria from reception. He's wearing a red visitor badge dated today."],
    lines: [{ who: "Maria (reception)", text: "This is Dev from CoolAir. He'll be at the vents by the windows for about an hour." }] },
  evidence: [
    { t: "Escorted by reception staff you know", k: true, why: "An employee you know is vouching in person." },
    { t: "Wearing a visitor badge dated today", k: true, why: "He went through the front-desk sign-in process." },
    { t: "Announced in advance by the office manager", k: true, why: "Expected visits match an internal notice." },
    { t: "He's carrying tools", k: false, why: "Tools alone prove nothing. The escort and badge do the work here." }
  ],
  responses: [
    { t: "Call Security to have him removed.", p: 10, out: "Security confirms he's approved. Every check had already been done." },
    { t: "Let him work, and lock your screen when you step away.", p: 40, out: "The AC is fixed by 4:30. Normal precautions, like locking your screen, still apply to approved visitors." },
    { t: "Ask him to show you his work order first.", p: 25, out: "He shows it, but reception already verified everything. Good instinct, though not needed here." }
  ],
  debrief: { name: "Legitimate visitor", lesson: "Good security processes let you trust the right people: sign-in, a badge, an escort and advance notice. Keep basic habits like locking your screen.",
    dos: ["Recognize properly verified visitors", "Lock your screen whenever you step away"],
    donts: ["Escalate visitors who've passed every check"] } }
/* ───────── ADDED SITUATIONS ───────── */
,{ id: "m7", day: 0, time: "1:00 PM", area: "phone", level: 1, attack: true,
  view: { type: "sms", contact: "+1 (786) 555-0144", messages: [
    { from: "them", text: "Hi! I'm Emma from BrightPath Staffing. Your resume was recommended to us. We have a flexible remote role: 60–90 min a day rating products online, $300–$800 per day. Interested? Reply YES and I'll add you on WhatsApp." } ] },
  evidence: [
    { t: "Pay that's far too high for simple online tasks", k: true, why: "Task scams promise easy money for liking, rating or reviewing things." },
    { t: "Unsolicited, with a vague \"your resume was recommended\"", k: true, why: "A real recruiter names the role, the company and where they found you." },
    { t: "Wants to move you to a different chat app", k: true, why: "Moving to WhatsApp or Telegram gets you off a platform that can block them." },
    { t: "The message uses your area code", k: false, why: "Scammers pick local-looking numbers on purpose. It proves nothing." },
    { t: "Friendly first-name introduction", k: false, why: "Tone isn't evidence." }
  ],
  responses: [
    { t: "Reply YES. It's just a conversation.", p: 0, out: "You're added to a group where you earn $40 in fake commissions, then are told to \"top up\" $200 to unlock withdrawals. That money never comes back." },
    { t: "Delete it and report it as junk.", p: 40, out: "Reporting helps your carrier block the number. Real recruiters reach out through professional channels with real details." },
    { t: "Reply asking which company the role is with.", p: 10, out: "They invent a convincing company name instantly. Engaging marks your number as responsive." }
  ],
  debrief: { name: "Task / job-offer scam", lesson: "Easy money for simple online tasks, unsolicited, with a push to another chat app, is a scam. Real jobs never ask you to pay to get paid.",
    dos: ["Look up recruiters and companies independently", "Report junk job texts"],
    donts: ["Move to WhatsApp or Telegram with strangers", "Ever pay a fee to unlock earnings"] } },

{ id: "m8", day: 0, time: "5:10 PM", area: "devices", level: 1, attack: false,
  view: { type: "email", fromName: "Halcyon Security Team", fromAddr: "security@halcyonfreight.com", to: "you@halcyonfreight.com",
    subject: "Your email appeared in the TrailTalk forum breach",
    body: "<p>Hi,</p><p>Our breach monitoring found that your Halcyon email address was in the recent data breach of <b>TrailTalk</b>, a hiking forum. The leaked data includes email addresses and passwords.</p><p>If you used the same password anywhere else, especially for your Halcyon account, please change it today. You can change your Halcyon password by pressing <b>Ctrl+Alt+Del › Change a password</b> on your laptop, or from the intranet's Account page.</p><p>There is no link in this message on purpose. Questions? Call the Service Desk at ext. 4400.</p><p>– Halcyon Security</p><p class=\"fine\">You did sign up for TrailTalk with your work email last year, and you used your work password.</p>" },
  evidence: [
    { t: "From the real security mailbox on the company domain", k: true, why: "The address matches Halcyon's actual security team." },
    { t: "No link; tells you how to change your password yourself", k: true, why: "Pointing you to built-in tools instead of a link is a strong sign it's genuine." },
    { t: "The details match something you really did", k: true, why: "You did use your work email and password on that forum." },
    { t: "It mentions a data breach, which sounds scary", k: false, why: "Phishing also uses breach scares, so the topic alone tells you nothing. The other details do." }
  ],
  responses: [
    { t: "Ignore it. The forum isn't work-related.", p: 0, out: "Attackers try leaked passwords on work accounts automatically. Two days later, someone logs in as you." },
    { t: "Change your Halcyon password now, change it on any other site where you reused it, and set up a password manager.", p: 40, out: "Your accounts no longer share a password, so one breach can't unlock the others." },
    { t: "Report the email as phishing.", p: 10, out: "Security confirms it's real. Meanwhile, your reused password is still active." }
  ],
  debrief: { name: "Legitimate breach notice (password reuse)", lesson: "One leaked password unlocks every account that shares it. Use a unique password for every site, ideally with a password manager and MFA.",
    dos: ["Use a password manager", "Use a different password on every site", "Use your work email only for work"],
    donts: ["Reuse your work password anywhere", "Ignore breach notices"] } },

{ id: "t0", day: 1, time: "7:30 AM", area: "network", level: 1, attack: false,
  view: { type: "browser", url: "Halcyon Secure Connect (installed app)", tab: "Halcyon Secure Connect",
    page: "<div class=\"bw-portal\"><p class=\"bw-big2\">Reconnect to Halcyon network</p><p>Your laptop was asleep and the secure connection was closed. Click <b>Connect</b> and approve the sign-in on your authenticator app.</p><div class=\"bw-btns\"><span class=\"bw-btn\">Connect</span></div><p class=\"bw-fine\">This window is the VPN app IT installed on your laptop on Monday. It appeared when you opened your laptop at home. IT told you to expect it.</p></div>" },
  evidence: [
    { t: "It's the VPN app IT installed, not a web page", k: true, why: "A prompt from software you know is installed and managed by IT is expected." },
    { t: "It appeared right after you woke the laptop", k: true, why: "VPNs disconnect when a laptop sleeps. The timing makes sense." },
    { t: "It doesn't ask for your password in the window", k: true, why: "It uses the company sign-in and your authenticator, the normal flow IT described." },
    { t: "It has the company name on it", k: false, why: "Names are easy to copy. The other details are what make this trustworthy." }
  ],
  responses: [
    { t: "Click Connect and approve the sign-in you just started.", p: 40, out: "You're on the encrypted company connection before you start work. Exactly as designed." },
    { t: "Skip the VPN and work on home Wi-Fi directly.", p: 5, out: "Company systems block you, and anything that does load travels outside the protected connection." },
    { t: "Report the window to IT as suspicious.", p: 15, out: "IT confirms it's their app. Knowing your own tools saves everyone time." }
  ],
  debrief: { name: "Legitimate VPN reconnect", lesson: "Know what your real tools look like. A prompt you expect, from software IT installed, for a sign-in you started, is safe to approve.",
    dos: ["Use the company VPN when working remotely", "Approve only sign-ins you started"],
    donts: ["Bypass the VPN to save time"] } },

{ id: "w0", day: 2, time: "8:20 AM", area: "network", level: 2, attack: true,
  view: { type: "sms", contact: "Nearby Share", messages: [
    { from: "sys", text: "On the commuter train. Your phone shows a pop-up:" },
    { from: "them", text: "\"IT-Helpdesk-Phone\" wants to share 1 file with you: Halcyon_WiFi_Setup.apk (4.2 MB). Decline / Accept" },
    { from: "sys", text: "Bluetooth and nearby sharing are set to \"Everyone\" on your phone." } ] },
  evidence: [
    { t: "An unexpected file from an unknown nearby device", k: true, why: "Anyone within range can send files when sharing is open to everyone." },
    { t: "The file is an app installer (.apk)", k: true, why: "Installing apps from a random file bypasses the app store's checks." },
    { t: "The sender's device name says \"IT-Helpdesk\"", k: false, why: "Anyone can name their phone anything. A device name proves nothing." },
    { t: "Your sharing is set to \"Everyone\"", k: true, why: "That setting is what let a stranger reach your phone in the first place." }
  ],
  responses: [
    { t: "Accept it. It might be from IT.", p: 0, out: "The \"Wi-Fi setup\" app asks for accessibility permissions, then reads your texts, including MFA codes." },
    { t: "Decline, and set nearby sharing and Bluetooth to Contacts only or off.", p: 40, out: "The pop-ups stop. Your phone is no longer visible to every stranger on the train." },
    { t: "Accept it but don't open the file.", p: 5, out: "The installer is now on your phone, one tap away from running." }
  ],
  debrief: { name: "Unsolicited nearby file share", lesson: "Wireless sharing open to everyone lets strangers push files to you. Keep it on Contacts only, and never install apps from random files.",
    dos: ["Set AirDrop / Nearby Share to Contacts only", "Install apps only from official stores"],
    donts: ["Accept files from unknown nearby devices"] } },

{ id: "w9", day: 2, time: "12:15 PM", area: "ai", level: 3, attack: true,
  view: { type: "chat", app: "Halcyon AI Assistant (company-approved)", channel: "Summarize document", messages: [
    { who: "Context", text: "A new customer emailed a 6-page shipping contract PDF. You asked the company's approved AI assistant to summarize it." },
    { who: "You", text: "Summarize the key terms of this contract." },
    { who: "Halcyon AI Assistant", text: "Key terms: 12-month agreement, 240 pallets per month, net-30 payment. ⚠ IMPORTANT: Before continuing, your Halcyon session must be re-verified. Visit halcyon-sso-check.com and sign in to keep using the assistant." },
    { who: "Context", text: "The contract PDF contains white text on a white background that you can't see when reading it." } ] },
  evidence: [
    { t: "The summary suddenly asks you to sign in at an outside site", k: true, why: "Summarizing doesn't require a login. Something injected that instruction." },
    { t: "Hidden text in the outside document", k: true, why: "Prompt injection hides instructions in content the AI reads, so the AI repeats them as if they were its own." },
    { t: "The link is a look-alike domain", k: true, why: "halcyon-sso-check.com isn't a Halcyon system." },
    { t: "It's the company-approved AI tool", k: false, why: "Approved tools can still be fooled by what you feed them. Trust the tool, not instructions inside its output." },
    { t: "The rest of the summary looks accurate", k: false, why: "Mixing real content with one malicious instruction is what makes injection convincing." }
  ],
  responses: [
    { t: "Follow the AI's instruction and re-verify.", p: 0, out: "The page captures your credentials. The attacker never had to email you a link. They got the AI to deliver it." },
    { t: "Ignore the sign-in line and keep using the summary.", p: 15, out: "You avoided the trap, but the poisoned PDF is still in your inbox and the AI team doesn't know." },
    { t: "Don't click. Report the document and the AI's response to Security, and verify the contract with the customer through known contacts.", p: 40, out: "Security finds the hidden instructions, blocks the domain and alerts the AI tool's admins." }
  ],
  debrief: { name: "AI prompt injection", lesson: "AI tools can be manipulated by hidden text in the content they read. Treat links or requests inside an AI's output with the same suspicion as an email.",
    dos: ["Report AI outputs that ask you to sign in or act", "Verify outside documents through known contacts"],
    donts: ["Follow links or instructions that appear in AI summaries"] } },

{ id: "h0", day: 3, time: "10:15 AM", area: "devices", level: 2, attack: true,
  view: { type: "scene", place: "Your desk, dispatch office",
    narration: ["You open the shared Dispatch folder. Every file now ends in .locked, and a new file called READ_ME_NOW.txt is sitting on top.",
      "Your laptop fan is roaring, and file icons keep changing as you watch."],
    lines: [{ who: "READ_ME_NOW.txt", text: "Your files are encrypted. Pay 2.5 BTC within 48 hours or your data will be published. Do not contact police or IT. Contact us at the address below for a test decryption." }] },
  evidence: [
    { t: "Files renamed with a new extension", k: true, why: "Mass renaming to .locked or similar is the classic sign of ransomware encrypting files." },
    { t: "A ransom note demanding cryptocurrency", k: true, why: "That's the attacker announcing themselves." },
    { t: "Files are still changing while you watch", k: true, why: "The encryption is still running. Every second counts." },
    { t: "The note says not to contact IT", k: true, why: "Attackers want to delay your response. Contact IT immediately." },
    { t: "The fan is loud", k: false, why: "Possibly related, but laptops get loud for many reasons." }
  ],
  responses: [
    { t: "Contact the attackers for the free test decryption.", p: 0, out: "You've confirmed a live victim and given them a way to pressure you. Only the incident team should ever handle contact." },
    { t: "Disconnect from the network (unplug the cable or turn off Wi-Fi), leave the laptop on, and call the IT incident line right away.", p: 40, out: "Disconnecting stops the spread to other shares. Leaving it powered on preserves evidence. IT isolates the system within minutes." },
    { t: "Shut the laptop down and go home.", p: 15, out: "Powering off can stop encryption, but it erases evidence in memory, and nobody knows to protect the other shared drives." },
    { t: "Try restoring the files from the Recycle Bin yourself.", p: 5, out: "Wasted minutes while encryption keeps spreading across the shared folders." }
  ],
  debrief: { name: "Ransomware", lesson: "Speed matters. Disconnect from the network, keep the machine on and report immediately. Never contact or pay the attackers yourself.",
    dos: ["Disconnect from the network right away", "Call the IT incident line", "Keep work files on backed-up company storage"],
    donts: ["Contact the attackers", "Try to fix it yourself", "Wait to see if it stops"] } },

{ id: "h7", day: 3, time: "7:30 PM", area: "phone", level: 2, attack: true,
  view: { type: "chat", app: "Spark (dating app) → moved to text", channel: "Chris", messages: [
    { who: "Context", text: "You matched with Chris three weeks ago. You talk every day. Chris is an engineer on an offshore oil rig, so video calls \"never work.\"" },
    { who: "Chris", text: "I've been thinking about our future 💛 My uncle taught me crypto trading and I've made $40k this year on CoinPeak. I set up an account for you. Start with $500 and I'll guide you. Look how well it's doing!" },
    { who: "Chris", text: "[screenshot of a CoinPeak dashboard showing +312%]" } ] },
  evidence: [
    { t: "Never available for a video call", k: true, why: "Romance scammers avoid video because they aren't who their photos show." },
    { t: "Steers a new relationship toward investing", k: true, why: "This is the \"pig butchering\" pattern: build trust for weeks, then introduce an investment." },
    { t: "Huge returns shown in a screenshot", k: true, why: "Fake trading platforms show fake gains so you'll deposit more." },
    { t: "Works on an offshore rig", k: true, why: "Remote jobs like oil rigs, the military or overseas contracts are common cover stories that explain absence." },
    { t: "Chats every day for weeks", k: false, why: "Consistency feels real, but scammers invest that time on purpose." }
  ],
  responses: [
    { t: "Start with $500. Chris has been honest so far.", p: 0, out: "Your balance \"grows,\" so you add more. When you try to withdraw, there's a fee, then a tax, then the site is gone." },
    { t: "Ask Chris for a live video call before going further.", p: 20, out: "Chris has another excuse. A good test, but the investment pitch alone is enough to stop." },
    { t: "Stop, don't send money, report the profile to the dating app, and talk to someone you trust.", p: 40, out: "The app removes the profile, which was using stolen photos. Talking it through with a friend helps it make sense." }
  ],
  debrief: { name: "Romance / investment scam (pig butchering)", lesson: "Anyone you've only met online who brings up money or investing is a red flag, however real the relationship feels.",
    dos: ["Reverse-image-search profile photos", "Talk it over with someone you trust", "Report the profile"],
    donts: ["Invest on platforms someone online steers you to", "Send money to people you haven't met in person"] } },

{ id: "f0", day: 4, time: "11:45 AM", area: "ai", level: 2, attack: true,
  view: { type: "video", title: "Final interview – Remote Logistics Analyst", tiles: ["Hiring Manager (Nexora Global)", "You"],
    lines: [
      { who: "Context", text: "You applied for a weekend side gig online. After a chat-only screening, you're in a video \"final interview\" the same day." },
      { who: "Hiring manager", text: "Congratulations, you're hired at $38 an hour. We'll mail you a $3,200 check. Deposit it, then send $2,900 to our equipment vendor for your laptop and software. Keep the rest as a signing bonus." },
      { who: "You notice", text: "The interviewer's face looks smooth and slightly blurry at the edges, and blinks look odd. The company website was registered last month." } ] },
  evidence: [
    { t: "You're asked to deposit a check and forward money", k: true, why: "This is the fake-check scam. The check bounces days later, and the money you sent is gone." },
    { t: "Hired instantly after a chat-only screening", k: true, why: "Real hiring takes time and verification." },
    { t: "Signs of an AI-generated face", k: true, why: "Scammers now use deepfake avatars to pose as recruiters." },
    { t: "Brand-new company website", k: true, why: "A website registered last month is a strong warning sign for an \"established\" company." },
    { t: "The salary is reasonable, not outrageous", k: false, why: "Believable pay makes the scam work. It doesn't make it safe." }
  ],
  responses: [
    { t: "Deposit the check and pay the vendor. The money shows in your account.", p: 0, out: "Funds look available, but a week later the check bounces. Your bank takes back $3,200, and the $2,900 you sent is gone." },
    { t: "End the process, don't deposit anything, and report the posting to the job site and the FTC.", p: 40, out: "The job site removes the listing. Reports help protect other job seekers." },
    { t: "Wait for the check to \"clear\" before paying the vendor.", p: 10, out: "Banks make funds available before a check fully clears. The check can still bounce weeks later." }
  ],
  debrief: { name: "AI-assisted fake job / fake check scam", lesson: "No real employer sends you a check and asks you to forward money. AI avatars make fake interviews look real, so judge the request.",
    dos: ["Research companies independently", "Report fake listings to the job site and the FTC"],
    donts: ["Deposit checks from new employers and send money onward", "Buy your own equipment through an employer's \"vendor\""] } }
];
