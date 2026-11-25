export interface GradientPreset {
  id: string
  name: string
  css: string
}

export const gradientPresets: GradientPreset[] = [
  { id: "sunset", name: "Sunset", css: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" },
  { id: "ocean", name: "Ocean", css: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)" },
  { id: "violet", name: "Violet", css: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { id: "peach", name: "Peach", css: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
  { id: "mint", name: "Mint", css: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
  { id: "midnight", name: "Midnight", css: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)" },
  { id: "flame", name: "Flame", css: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)" },
  { id: "aurora", name: "Aurora", css: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)" },
]

export interface CustomGradient {
  from: string
  to: string
  angle: number
}

export const defaultCustomGradient: CustomGradient = {
  from: "#6366f1",
  to: "#ec4899",
  angle: 135,
}

export const buildGradientCss = ({ from, to, angle }: CustomGradient) =>
  `linear-gradient(${angle}deg, ${from}, ${to})`
