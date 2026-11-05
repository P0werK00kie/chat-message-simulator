import { useMemo, type ReactNode } from "react"
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Lock,
  Plus,
  RotateCw,
  Share,
  SquareStack,
} from "lucide-react"
import type { ThemeId } from "@/types/layout"
import { cn } from "@/utils/cn"

export type SafariVariant = "mobile" | "desktop"

interface SafariChromeProps {
  url: string
  variant: SafariVariant
  themeId: ThemeId
  children: ReactNode
}

interface ParsedAddress {
  text: string
  secure: boolean
}

const parseAddress = (rawUrl: string): ParsedAddress | null => {
  const trimmed = rawUrl.trim()
  if (!trimmed) return null
  try {
    const parsed = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`)
    const path = parsed.pathname !== "/" ? parsed.pathname : ""
    return { text: `${parsed.hostname}${path}`, secure: parsed.protocol !== "http:" }
  } catch {
    return { text: trimmed, secure: false }
  }
}

export const SafariChrome = ({ url, variant, themeId, children }: SafariChromeProps) => {
  const address = useMemo(() => parseAddress(url), [url])
  const isDark = themeId === "dark"
  const barClass = isDark ? "bg-neutral-800 text-neutral-100" : "bg-neutral-200 text-neutral-900"
  const hairlineClass = isDark ? "border-white/10" : "border-black/10"
  const mutedIconClass = isDark ? "text-neutral-400" : "text-neutral-500"
  const pillClass = isDark ? "bg-neutral-700 text-neutral-200" : "bg-white text-neutral-700"

  const addressPill = (
    <div
      className={cn(
        pillClass,
        "flex h-7 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[13px]",
      )}
    >
      {address?.secure ? <Lock className="h-3 w-3 shrink-0" /> : null}
      <span className="truncate">
        {address ? address.text : <span className={mutedIconClass}>Search or enter website name</span>}
      </span>
    </div>
  )

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      {variant === "desktop" ? (
        <>
          <div className={cn(barClass, "flex h-9 shrink-0 items-center gap-2 px-3")}>
            <span className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </span>
            <div
              className={cn(
                pillClass,
                "ml-2 flex h-7 max-w-[220px] min-w-0 items-center gap-1.5 rounded-t-md px-3 text-[12px]",
              )}
            >
              {address?.secure ? <Lock className="h-3 w-3 shrink-0" /> : null}
              <span className="truncate">{address ? address.text : "New Tab"}</span>
            </div>
          </div>
          <div className={cn(barClass, hairlineClass, "flex h-11 shrink-0 items-center gap-2 border-t px-3")}>
            <ChevronLeft className={cn("h-4 w-4", mutedIconClass)} />
            <ChevronRight className={cn("h-4 w-4", mutedIconClass)} />
            <RotateCw className={cn("h-3.5 w-3.5", mutedIconClass)} />
            <div className="mx-auto w-full max-w-[480px]">{addressPill}</div>
            <Share className={cn("h-4 w-4", mutedIconClass)} />
            <Plus className={cn("h-4 w-4", mutedIconClass)} />
          </div>
        </>
      ) : (
        <div className={cn(barClass, "flex h-11 shrink-0 items-center gap-2 px-3")}>
          {addressPill}
          <RotateCw className={cn("h-4 w-4 shrink-0", mutedIconClass)} />
        </div>
      )}

      <div className="relative min-h-0 flex-1">{children}</div>

      {variant === "mobile" ? (
        <div
          className={cn(
            barClass,
            hairlineClass,
            "flex h-12 shrink-0 items-center justify-between border-t px-5",
          )}
        >
          <ChevronLeft className={cn("h-5 w-5", mutedIconClass)} />
          <ChevronRight className={cn("h-5 w-5", mutedIconClass)} />
          <Share className={cn("h-5 w-5", mutedIconClass)} />
          <BookOpen className={cn("h-5 w-5", mutedIconClass)} />
          <SquareStack className={cn("h-5 w-5", mutedIconClass)} />
        </div>
      ) : null}
    </div>
  )
}
