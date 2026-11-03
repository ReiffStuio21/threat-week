// Videos generated with Higgsfield (Seedance 2.5) for Launching IT Solutions.
// scripts/fetch-media.mjs copies them into /media at build time so Vercel serves them.
export const HERO = {
  video: "/media/hero.mp4",
  poster: "/media/hero-poster.webp",
}

// Order matches VECTORS: email, phone, AI, network, physical, devices.
export const CLIPS = ["email", "phone", "ai", "network", "physical", "devices"].map((k) => `/media/clip-${k}.mp4`)
