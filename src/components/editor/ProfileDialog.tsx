import { useState } from "react"
import { AtSign, Loader2, MapPin, X } from "lucide-react"
import type { Participant } from "@/types/conversation"
import { useConversationStore, useMapboxToken } from "@/store/conversationStore"
import { toast } from "@/store/toastStore"
import { AvatarUpload } from "@/components/editor/AvatarUpload"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { geocodeAddress, getStaticMapUrl } from "@/utils/mapbox"

interface ProfileDialogProps {
  participant: Participant | null
  onOpenChange: (open: boolean) => void
  onChange: (participantId: string, updates: Partial<Participant>) => void
}

const sanitizeUsername = (value: string) => value.replace(/^@+/, "").replace(/\s+/g, "")

export const ProfileDialog = ({ participant, onOpenChange, onChange }: ProfileDialogProps) => {
  const mapboxToken = useMapboxToken()
  const setUi = useConversationStore((state) => state.setUi)
  const [addressInput, setAddressInput] = useState("")
  const [isLocating, setIsLocating] = useState(false)
  const [syncedParticipantId, setSyncedParticipantId] = useState<string | null>(null)

  // Reset the draft address whenever the dialog switches to a different participant.
  if ((participant?.id ?? null) !== syncedParticipantId) {
    setSyncedParticipantId(participant?.id ?? null)
    setAddressInput(participant?.location?.address ?? "")
  }

  const findOnMap = async () => {
    if (!participant) return
    const address = addressInput.trim()
    if (!address) {
      onChange(participant.id, { location: undefined })
      return
    }
    if (!mapboxToken) {
      toast("Add a Mapbox access token in Style → Map first.", "error")
      return
    }
    setIsLocating(true)
    try {
      const point = await geocodeAddress(address, mapboxToken)
      onChange(participant.id, { location: { address, ...point } })
    } catch (error) {
      toast(error instanceof Error ? error.message : "Could not look up that address.", "error")
    } finally {
      setIsLocating(false)
    }
  }

  return (
    <Dialog open={participant !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        {participant ? (
          <>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Set how {participant.name || "this person"} appears across the chat.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex items-center gap-4">
              <AvatarUpload
                participant={participant}
                onChange={(avatarUrl) => onChange(participant.id, { avatarUrl })}
              />
              <p className="text-xs text-neutral-500">Click or drop an image to change the profile photo.</p>
            </div>

            <div className="mt-5 max-h-[60vh] space-y-4 overflow-y-auto pr-1">
              <div className="space-y-1.5">
                <Label htmlFor="profile-name">Name</Label>
                <Input
                  id="profile-name"
                  value={participant.name}
                  onChange={(event) => onChange(participant.id, { name: event.target.value })}
                  placeholder="Name"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profile-username">Username</Label>
                <div className="relative">
                  <AtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <Input
                    id="profile-username"
                    value={participant.username ?? ""}
                    onChange={(event) =>
                      onChange(participant.id, { username: sanitizeUsername(event.target.value) })
                    }
                    placeholder="username"
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profile-last-active">Last active</Label>
                <Input
                  id="profile-last-active"
                  value={participant.lastActive ?? ""}
                  onChange={(event) => onChange(participant.id, { lastActive: event.target.value })}
                  placeholder="Active 2 hours ago"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Accent color</Label>
                <div className="flex items-center gap-2">
                  <label
                    className="relative h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-neutral-200"
                    style={{ backgroundColor: participant.color }}
                    title="Color (used for initials and group names)"
                  >
                    <input
                      type="color"
                      value={participant.color}
                      onChange={(event) => onChange(participant.id, { color: event.target.value })}
                      className="absolute inset-0 cursor-pointer opacity-0"
                      aria-label="Accent color"
                    />
                  </label>
                  <Input
                    value={participant.color}
                    onChange={(event) => onChange(participant.id, { color: event.target.value })}
                    className="h-9 font-mono text-xs"
                    aria-label="Accent color hex"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="profile-address">Location</Label>
                  {!mapboxToken ? (
                    <button
                      type="button"
                      className="text-xs text-neutral-500 underline-offset-2 hover:underline"
                      onClick={() => {
                        onOpenChange(false)
                        setUi({ activePanel: "settings", activeView: "editor" })
                      }}
                    >
                      Add a Mapbox token
                    </button>
                  ) : null}
                </div>
                <form
                  className="flex items-center gap-2"
                  onSubmit={(event) => {
                    event.preventDefault()
                    void findOnMap()
                  }}
                >
                  <div className="relative flex-1">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                      id="profile-address"
                      value={addressInput}
                      onChange={(event) => setAddressInput(event.target.value)}
                      placeholder="Address or place"
                      className="pl-8"
                    />
                  </div>
                  <Button type="submit" variant="outline" size="sm" disabled={isLocating}>
                    {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Find"}
                  </Button>
                  {participant.location ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Remove location"
                      onClick={() => {
                        setAddressInput("")
                        onChange(participant.id, { location: undefined })
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  ) : null}
                </form>
                {participant.location && mapboxToken ? (
                  <img
                    src={getStaticMapUrl(participant.location, mapboxToken)}
                    alt={`Map of ${participant.location.address}`}
                    className="h-28 w-full rounded-lg border border-neutral-200 object-cover"
                  />
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
