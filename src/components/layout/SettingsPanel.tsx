import { useRef, useState, type ReactNode } from "react"
import { ImagePlus, Moon, Sun, X } from "lucide-react"
import { getLayoutConfig } from "@/constants/layouts"
import { buildGradientCss, gradientPresets } from "@/constants/gradients"
import { envMapboxToken, useConversationStore } from "@/store/conversationStore"
import { toast } from "@/store/toastStore"
import { useFileDrop } from "@/hooks/useFileDrop"
import { LayoutPicker } from "@/components/layout/LayoutSelector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Segmented } from "@/components/ui/segmented"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/utils/cn"
import { clamp, readImageFile } from "@/utils/helpers"

const BACKGROUND_MAX_SIZE = 1600

const Section = ({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) => (
  <section className="space-y-2.5">
    <div>
      <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
      {hint ? <p className="text-xs text-neutral-500">{hint}</p> : null}
    </div>
    {children}
  </section>
)

export const SettingsPanel = () => {
  const layoutId = useConversationStore((state) => state.layoutId)
  const themeId = useConversationStore((state) => state.themeId)
  const setTheme = useConversationStore((state) => state.setTheme)
  const viewMode = useConversationStore((state) => state.viewMode)
  const setViewMode = useConversationStore((state) => state.setViewMode)
  const browserUrl = useConversationStore((state) => state.browserUrl)
  const setBrowserUrl = useConversationStore((state) => state.setBrowserUrl)
  const showChrome = useConversationStore((state) => state.ui.showChrome)
  const setUi = useConversationStore((state) => state.setUi)
  const backgroundImageUrl = useConversationStore((state) => state.backgroundImageUrl)
  const backgroundImageOpacity = useConversationStore((state) => state.backgroundImageOpacity)
  const setBackgroundImageUrl = useConversationStore((state) => state.setBackgroundImageUrl)
  const setBackgroundImageOpacity = useConversationStore((state) => state.setBackgroundImageOpacity)
  const clearBackgroundImage = useConversationStore((state) => state.clearBackgroundImage)
  const backgroundColor = useConversationStore((state) => state.backgroundColor)
  const setBackgroundColor = useConversationStore((state) => state.setBackgroundColor)
  const backgroundGradient = useConversationStore((state) => state.backgroundGradient)
  const setBackgroundGradient = useConversationStore((state) => state.setBackgroundGradient)
  const customGradient = useConversationStore((state) => state.customGradient)
  const setCustomGradient = useConversationStore((state) => state.setCustomGradient)
  const clearBackgroundFill = useConversationStore((state) => state.clearBackgroundFill)
  const mapboxToken = useConversationStore((state) => state.mapboxToken)
  const setMapboxToken = useConversationStore((state) => state.setMapboxToken)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [fillMode, setFillMode] = useState<"solid" | "gradient">(backgroundGradient ? "gradient" : "solid")
  const [prevFill, setPrevFill] = useState({ backgroundColor, backgroundGradient })
  if (prevFill.backgroundColor !== backgroundColor || prevFill.backgroundGradient !== backgroundGradient) {
    setPrevFill({ backgroundColor, backgroundGradient })
    if (backgroundGradient) setFillMode("gradient")
    else if (backgroundColor) setFillMode("solid")
  }

  const layout = getLayoutConfig(layoutId)
  const hasDark = layout.themes.some((theme) => theme.id === "dark")
  const themeBackground =
    (layout.themes.find((theme) => theme.id === themeId) ?? layout.themes[0]).colors.background
  const opacityPercent = Math.round(backgroundImageOpacity * 100)
  const customGradientCss = buildGradientCss(customGradient)

  const uploadBackground = async (file: File) => {
    try {
      setBackgroundImageUrl(await readImageFile(file, BACKGROUND_MAX_SIZE))
    } catch (error) {
      toast(error instanceof Error ? error.message : "Could not read the image.", "error")
    }
  }
  const { isOver, dropProps } = useFileDrop((files) => {
    const image = files.find((file) => file.type.startsWith("image/"))
    if (image) void uploadBackground(image)
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-base font-semibold text-neutral-900">Style</h2>
        <p className="text-xs text-neutral-500">Pick the messaging app and how its screen looks.</p>
      </div>

      <Section title="App">
        <LayoutPicker />
      </Section>

      <Section title="Window" hint="Wrap the chat in a browser frame, like a chat web-app viewed in Safari.">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-neutral-600">Frame</span>
          <Segmented
            label="Window frame"
            size="sm"
            value={viewMode}
            onChange={setViewMode}
            options={[
              { value: "app", label: "App" },
              { value: "browser", label: "Safari" },
            ]}
          />
        </div>
        {viewMode === "browser" ? (
          <Input
            value={browserUrl}
            onChange={(event) => setBrowserUrl(event.target.value)}
            placeholder="example.com"
            aria-label="Browser address bar URL"
          />
        ) : null}
      </Section>

      <Section title="Appearance">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-neutral-600">Theme</span>
          <Segmented
            label="Theme"
            size="sm"
            value={themeId}
            onChange={(value) => setTheme(value === "dark" && hasDark ? "dark" : "light")}
            options={[
              { value: "light", label: <><Sun />Light</> },
              { value: "dark", label: <><Moon />Dark</> },
            ]}
          />
        </div>
        <label className="flex items-center justify-between gap-3">
          <span>
            <span className="block text-sm text-neutral-600">App header &amp; input bar</span>
            <span className="block text-xs text-neutral-400">Turn off for a bubbles-only image.</span>
          </span>
          <Switch checked={showChrome} onCheckedChange={(value) => setUi({ showChrome: value })} />
        </label>
      </Section>

      <Section title="Wallpaper" hint="Drop an image below, or pick a solid color or gradient.">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg border border-dashed border-neutral-300 p-2.5 transition",
            isOver && "border-black bg-neutral-50",
          )}
          {...dropProps}
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-400 transition hover:border-neutral-300 focus-visible:ring-2 focus-visible:ring-black/50 focus-visible:outline-none"
            style={{ background: backgroundGradient || backgroundColor || themeBackground }}
            aria-label="Upload wallpaper image"
          >
            {backgroundImageUrl ? (
              <img
                src={backgroundImageUrl}
                alt=""
                className="h-full w-full object-cover"
                style={{ opacity: backgroundImageOpacity }}
              />
            ) : (
              <ImagePlus className="h-5 w-5" />
            )}
          </button>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap gap-1.5">
              <Button variant="outline" size="xs" onClick={() => fileInputRef.current?.click()}>
                {backgroundImageUrl ? "Replace image" : "Upload image"}
              </Button>
              {backgroundImageUrl ? (
                <Button variant="ghost" size="xs" onClick={clearBackgroundImage}>
                  <X className="h-3.5 w-3.5" />
                  Remove
                </Button>
              ) : null}
            </div>
            <div className={cn("space-y-1", !backgroundImageUrl && "opacity-50")}>
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Image opacity</span>
                <span className="tabular-nums">{opacityPercent}%</span>
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[opacityPercent]}
                onValueChange={(value) => setBackgroundImageOpacity(clamp(value[0] / 100, 0, 1))}
                disabled={!backgroundImageUrl}
                aria-label="Wallpaper image opacity"
              />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ""
              if (file) void uploadBackground(file)
            }}
          />
        </div>
        <Segmented
          label="Wallpaper fill type"
          size="sm"
          value={fillMode}
          onChange={setFillMode}
          options={[
            { value: "solid", label: "Solid" },
            { value: "gradient", label: "Gradient" },
          ]}
        />

        {fillMode === "solid" ? (
          <div className="flex items-center gap-2">
            <label
              className="relative h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-neutral-200"
              style={{ backgroundColor: backgroundColor || themeBackground }}
            >
              <input
                type="color"
                value={backgroundColor || themeBackground}
                onChange={(event) => setBackgroundColor(event.target.value)}
                className="absolute inset-0 cursor-pointer opacity-0"
                aria-label="Wallpaper color"
              />
            </label>
            <Input
              value={backgroundColor}
              onChange={(event) => setBackgroundColor(event.target.value)}
              placeholder={`${themeBackground} (app default)`}
              className="h-9 font-mono text-xs"
              aria-label="Wallpaper color hex"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBackgroundColor("")}
              disabled={!backgroundColor}
            >
              Reset
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2">
              {gradientPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setBackgroundGradient(preset.css)}
                  className={cn(
                    "h-10 rounded-lg border-2 transition focus-visible:ring-2 focus-visible:ring-black/50 focus-visible:outline-none",
                    backgroundGradient === preset.css
                      ? "border-black"
                      : "border-transparent hover:border-neutral-300",
                  )}
                  style={{ backgroundImage: preset.css }}
                  title={preset.name}
                  aria-label={preset.name}
                  aria-pressed={backgroundGradient === preset.css}
                />
              ))}
            </div>

            <div className="space-y-2 rounded-lg border border-neutral-200 p-2.5">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Custom gradient</span>
                <span className="tabular-nums">{customGradient.angle}°</span>
              </div>
              <div
                className="h-10 w-full rounded-lg border border-neutral-200"
                style={{ backgroundImage: customGradientCss }}
              />
              <div className="flex items-center gap-2">
                <label
                  className="relative h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded-md border border-neutral-200"
                  style={{ backgroundColor: customGradient.from }}
                >
                  <input
                    type="color"
                    value={customGradient.from}
                    onChange={(event) => setCustomGradient({ from: event.target.value })}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    aria-label="Gradient start color"
                  />
                </label>
                <Input
                  value={customGradient.from}
                  onChange={(event) => setCustomGradient({ from: event.target.value })}
                  className="h-8 font-mono text-xs"
                  aria-label="Gradient start color hex"
                />
                <span className="text-xs text-neutral-400">to</span>
                <label
                  className="relative h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded-md border border-neutral-200"
                  style={{ backgroundColor: customGradient.to }}
                >
                  <input
                    type="color"
                    value={customGradient.to}
                    onChange={(event) => setCustomGradient({ to: event.target.value })}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    aria-label="Gradient end color"
                  />
                </label>
                <Input
                  value={customGradient.to}
                  onChange={(event) => setCustomGradient({ to: event.target.value })}
                  className="h-8 font-mono text-xs"
                  aria-label="Gradient end color hex"
                />
              </div>
              <Slider
                min={0}
                max={360}
                step={1}
                value={[customGradient.angle]}
                onValueChange={(value) => setCustomGradient({ angle: value[0] })}
                aria-label="Gradient angle"
              />
            </div>

            <Button variant="ghost" size="sm" onClick={clearBackgroundFill} disabled={!backgroundGradient}>
              Reset
            </Button>
          </div>
        )}
      </Section>

      <Section
        title="Map"
        hint="Add your own Mapbox access token to show a profile's location on a small map."
      >
        <Input
          value={mapboxToken}
          onChange={(event) => setMapboxToken(event.target.value.trim())}
          placeholder={
            envMapboxToken
              ? "Using the token from VITE_MAPBOX_TOKEN"
              : "pk.eyJ1Ijoi… (your Mapbox access token)"
          }
          className="font-mono text-xs"
          aria-label="Mapbox access token"
        />
        <p className="text-[11px] text-neutral-400">
          Stored only in this browser, never included in exported images or conversation files.
          {envMapboxToken ? " Leave blank to use the token configured in .env." : ""}
        </p>
      </Section>
    </div>
  )
}
