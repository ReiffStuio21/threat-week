// Downloads the Higgsfield-generated videos into public/media at build time,
// so the deployed site serves them from Vercel instead of hot-linking the generator's CDN.
import { mkdir, writeFile, stat } from "node:fs/promises"
import { join } from "node:path"

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3EoMYNL5unRSof3i2C4nImuct16"
const FILES = {
  "hero.mp4": "hf_20261103_221423_77b4731d-b1b2-4b79-8d12-fbe9fd3c59bd.mp4",
  "hero-poster.webp": "hf_20261103_221228_224c13cc-71db-4262-ba36-9bbe6bc9ff8b_min.webp",
  "clip-email.mp4": "hf_20261103_221414_3680e9f8-f137-44a7-83e1-daa670f10dc9.mp4",
  "clip-phone.mp4": "hf_20261103_221414_d6ca2cd4-8391-4146-84c4-34766705dcdb.mp4",
  "clip-ai.mp4": "hf_20261103_221414_dda9595c-ac93-4f95-9e3b-981841b11752.mp4",
  "clip-network.mp4": "hf_20261103_221414_54d35771-8014-41c6-8dd8-de3d5a058dc0.mp4",
  "clip-physical.mp4": "hf_20261103_221415_007f1b96-7291-4527-bc9c-9ffee4737c02.mp4",
  "clip-devices.mp4": "hf_20261103_221414_13cefc53-696a-496d-9916-014219d97958.mp4",
}

const dir = join(process.cwd(), "public", "media")
await mkdir(dir, { recursive: true })
const manifest = {}
let failed = 0
for (const [name, src] of Object.entries(FILES)) {
  const out = join(dir, name)
  try {
    const s = await stat(out)
    if (s.size > 0) { manifest[name] = s.size; continue }
  } catch {}
  try {
    const res = await fetch(`${CDN}/${src}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    await writeFile(out, buf)
    manifest[name] = buf.length
    console.log(`media: ${name} ${(buf.length / 1e6).toFixed(1)} MB`)
  } catch (e) {
    failed++
    console.warn(`media: could not download ${name}: ${e.message}`)
  }
}
await writeFile(join(dir, "manifest.json"), JSON.stringify({ files: manifest, builtAt: new Date().toISOString() }, null, 2))
if (failed && process.env.VERCEL) { console.error(`media: ${failed} file(s) failed to download`); process.exit(1) }
