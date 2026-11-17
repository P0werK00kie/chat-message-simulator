import { ArrowLeft, ChevronLeft, MapPin } from "lucide-react"
import type { Participant } from "@/types/conversation"
import type { LayoutConfig, LayoutTheme } from "@/types/layout"
import { ParticipantAvatar } from "@/components/ui/participant-avatar"
import { VerifiedBadge } from "@/components/ui/verified-badge"
import { getStaticMapUrl } from "@/utils/mapbox"

interface ProfileScreenProps {
  participant: Participant
  layout: LayoutConfig
  theme: LayoutTheme
  mapboxToken?: string
  onBack?: () => void
}

// A dedicated "contact info" style screen, like tapping a chat's header in a real messaging app.
export const ProfileScreen = ({ participant, layout, theme, mapboxToken, onBack }: ProfileScreenProps) => {
  const BackIcon = layout.id === "instagram" ? ChevronLeft : ArrowLeft

  return (
    <div
      className="flex h-full w-full flex-col"
      style={{ backgroundColor: theme.colors.surface, color: theme.colors.inputText }}
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
        <span className="text-sm font-semibold">Contact info</span>
      </div>

      <div className="flex flex-1 flex-col items-center gap-2 overflow-y-auto px-6 py-10 text-center">
        <ParticipantAvatar participant={participant} className="h-28 w-28 text-3xl" />
        <div className="mt-3 flex items-center gap-1.5">
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
        <div className="mt-4 h-1 w-10 rounded-full" style={{ backgroundColor: theme.colors.accent }} />

        {participant.location ? (
          <div className="mt-6 w-full max-w-[280px] text-left">
            <p
              className="mb-1.5 flex items-center gap-1 px-0.5 text-xs font-semibold tracking-wide uppercase"
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
                className="h-32 w-full rounded-xl object-cover"
                style={{ border: `1px solid ${theme.colors.border}` }}
              />
            ) : (
              <div
                className="flex h-32 w-full items-center justify-center rounded-xl px-3 text-center text-xs"
                style={{
                  backgroundColor: theme.colors.input,
                  color: theme.colors.muted,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                Add a Mapbox token in Style → Map to preview this location.
              </div>
            )}
            <p className="mt-1.5 px-0.5 text-sm">{participant.location.address}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
