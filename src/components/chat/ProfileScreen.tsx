import { ArrowLeft, Ban, ChevronLeft, Flag, MapPin, ShieldCheck, UserMinus } from "lucide-react"
import type { Participant } from "@/types/conversation"
import type { LayoutConfig, LayoutTheme } from "@/types/layout"
import { ParticipantAvatar } from "@/components/ui/participant-avatar"
import { VerifiedBadge } from "@/components/ui/verified-badge"
import { getStaticMapUrl } from "@/utils/mapbox"
import { formatNearAddress } from "@/utils/helpers"

const contactActions = [
  { key: "report", label: "Report", icon: Flag },
  { key: "block", label: "Block", icon: Ban },
  { key: "removeFriend", label: "Remove Friend", icon: UserMinus },
] as const

// Distinct, theme-aware colors so the three actions read at a glance: amber for a soft
// warning, red for the two destructive ones, muted slate kept apart from the accent color.
const contactActionPalette: Record<
  "light" | "dark",
  Record<(typeof contactActions)[number]["key"], { bg: string; fg: string }>
> = {
  light: {
    report: { bg: "#fef3c7", fg: "#b45309" },
    block: { bg: "#fee2e2", fg: "#b91c1c" },
    removeFriend: { bg: "#f1f5f9", fg: "#334155" },
  },
  dark: {
    report: { bg: "rgba(245, 158, 11, 0.16)", fg: "#fbbf24" },
    block: { bg: "rgba(239, 68, 68, 0.16)", fg: "#f87171" },
    removeFriend: { bg: "rgba(148, 163, 184, 0.16)", fg: "#cbd5e1" },
  },
}

interface ProfileScreenProps {
  participant: Participant
  layout: LayoutConfig
  theme: LayoutTheme
  background?: string
  mapboxToken?: string
  onBack?: () => void
}

// A dedicated "contact info" style screen, like tapping a chat's header in a real messaging app.
export const ProfileScreen = ({
  participant,
  layout,
  theme,
  background,
  mapboxToken,
  onBack,
}: ProfileScreenProps) => {
  const BackIcon = layout.id === "instagram" ? ChevronLeft : ArrowLeft

  return (
    <div
      className="flex h-full w-full flex-col"
      style={{ background: background || theme.colors.surface, color: theme.colors.inputText }}
    >
      <div
        className="flex shrink-0 items-center gap-3 px-3 py-3"
        style={{ backgroundColor: theme.colors.header, color: theme.colors.headerText }}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to chat"
          className="rounded-full p-1.5 transition hover:bg-white/10"
        >
          <BackIcon className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold">Back to Chat</span>
      </div>

      <div className="flex flex-1 flex-col items-center gap-1.5 overflow-y-auto px-6 py-6 text-center">
        <ParticipantAvatar participant={participant} className="h-20 w-20 text-2xl" />
        <div className="mt-2 flex items-center gap-1.5">
          <h2 className="text-xl font-semibold">{participant.name || "Unnamed"}</h2>
          {participant.isVerified ? <VerifiedBadge className="h-4 w-4 shrink-0" /> : null}
        </div>
        {participant.username ? (
          <p className="text-sm" style={{ color: theme.colors.muted }}>
            @{participant.username}
          </p>
        ) : null}
        {participant.lastActive ? (
          <p className="text-xs" style={{ color: theme.colors.muted }}>
            {participant.lastActive}
          </p>
        ) : null}
        <div className="mt-2 h-1 w-10 rounded-full" style={{ backgroundColor: theme.colors.accent }} />

        {participant.location ? (
          <div className="mt-3 w-full max-w-[280px] text-left">
            <p
              className="mb-1 flex items-center gap-1 px-0.5 text-xs font-semibold tracking-wide uppercase"
              style={{ color: theme.colors.muted }}
            >
              <MapPin className="h-3 w-3" />
              Location
            </p>
            {mapboxToken ? (
              <img
                src={getStaticMapUrl(participant.location, mapboxToken, {
                  pinColor: participant.color,
                })}
                alt={`Map of ${participant.location.address}`}
                className="h-24 w-full rounded-xl object-cover"
                style={{ border: `1px solid ${theme.colors.border}` }}
              />
            ) : (
              <div
                className="flex h-24 w-full items-center justify-center rounded-xl px-3 text-center text-xs"
                style={{
                  backgroundColor: theme.colors.input,
                  color: theme.colors.muted,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                Add a Mapbox token in Style → Map to preview this location.
              </div>
            )}
            <p className="mt-1 px-0.5 text-sm" title={participant.location.address}>
              {formatNearAddress(participant.location.address)}
            </p>
          </div>
        ) : null}

        <div className="mt-3 w-full max-w-[280px] space-y-1.5">
          {contactActions.map(({ key, label, icon: Icon }) => {
            const { bg, fg } = contactActionPalette[theme.id][key]
            return (
              <button
                key={key}
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition hover:brightness-95"
                style={{ backgroundColor: bg, color: fg }}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            )
          })}
        </div>

        {participant.isVerified ? (
          <div
            className="mt-2.5 flex w-full max-w-[280px] items-start gap-2 rounded-xl px-3 py-2 text-left text-xs"
            style={{
              backgroundColor: theme.colors.input,
              color: theme.colors.muted,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <ShieldCheck
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              style={{ color: theme.colors.accent }}
            />
            <span>This account has been ID verified, if you have any questions, please contact us.</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
