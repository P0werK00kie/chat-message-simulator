import { Camera } from "lucide-react"
import type { Message } from "@/types/message"
import { cn } from "@/utils/cn"

// Snapchat's chat-log status row for a snap: a bordered pill with a direction icon
// (arrow = sent, square = received), a bold label, an optional "Hold to replay" line,
// and a camera badge when the snap still has media to replay or save. No image is ever
// shown — the point of this element is to stand in for a snap without rendering one.
const ReceiptIcon = ({ isOwn, filled }: { isOwn: boolean; filled: boolean }) => {
  const color = "var(--bubble-received)"
  if (!isOwn) {
    return (
      <span
        className="h-[17px] w-[17px] shrink-0 rounded-[3px]"
        style={{ border: `2px solid ${color}`, backgroundColor: filled ? color : "transparent" }}
        aria-hidden="true"
      />
    )
  }
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
      <path
        d="M5 3 L20 12 L5 21 Z"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const SnapchatReceipt = ({ message, isOwn }: { message: Message; isOwn: boolean }) => {
  const [primary, ...rest] = (message.content || "Opened").split("\n")
  const subtext = rest.join(" ").trim()
  const filled = message.status === "delivered"
  const showMedia = message.status === "read"

  return (
    <div className={cn("flex w-full", isOwn ? "justify-end" : "justify-start")}>
      <div
        className="flex max-w-[82%] items-center gap-2.5 rounded-2xl border px-3 py-2"
        style={{ borderColor: "var(--bubble-received)", backgroundColor: "var(--chat-input-inner)" }}
      >
        <ReceiptIcon isOwn={isOwn} filled={filled} />
        <div className="min-w-0">
          <div className="truncate text-[13px] font-bold" style={{ color: "var(--chat-header-text)" }}>
            {primary}
          </div>
          {subtext ? (
            <div className="truncate text-[11.5px]" style={{ color: "var(--chat-muted)" }}>
              {subtext}
            </div>
          ) : null}
        </div>
        {showMedia ? (
          <span
            className="relative ml-1 flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full"
            aria-hidden="true"
          >
            <span className="absolute inset-0 bg-[var(--chat-muted)] opacity-30" />
            <Camera className="relative h-3.5 w-3.5" style={{ color: "var(--chat-header-text)" }} />
          </span>
        ) : null}
      </div>
    </div>
  )
}
