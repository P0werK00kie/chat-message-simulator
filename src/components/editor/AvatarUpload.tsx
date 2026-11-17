import { useRef } from "react"
import { Camera } from "lucide-react"
import type { Participant } from "@/types/conversation"
import { toast } from "@/store/toastStore"
import { useFileDrop } from "@/hooks/useFileDrop"
import { VerifiedBadge } from "@/components/ui/verified-badge"
import { ParticipantAvatar } from "@/components/ui/participant-avatar"
import { cn } from "@/utils/cn"
import { readImageFile } from "@/utils/helpers"

const AVATAR_MAX_SIZE = 256

export const AvatarUpload = ({
  participant,
  onChange,
}: {
  participant: Participant
  onChange: (avatarUrl: string) => void
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const upload = async (file: File) => {
    try {
      onChange(await readImageFile(file, AVATAR_MAX_SIZE))
    } catch (error) {
      toast(error instanceof Error ? error.message : "Could not read the image.", "error")
    }
  }
  const { isOver, dropProps } = useFileDrop((files) => {
    const image = files.find((file) => file.type.startsWith("image/"))
    if (image) void upload(image)
  })

  return (
    <div className="relative shrink-0" {...dropProps}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "group/avatar relative block rounded-md transition focus-visible:ring-2 focus-visible:ring-black/50 focus-visible:ring-offset-2 focus-visible:outline-none",
          isOver && "ring-offset-2",
        )}
        aria-label={`Change avatar for ${participant.name || "this person"}`}
        title="Click or drop an image"
      >
        <ParticipantAvatar participant={participant} className="h-14 w-14 text-base" />
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-md bg-black/50 text-white opacity-0 transition group-hover/avatar:opacity-100",
            isOver && "opacity-100",
          )}
        >
          <Camera className="h-4 w-4" />
        </span>
      </button>
      {participant.isVerified ? (
        <span className="pointer-events-none absolute -right-0.5 -bottom-0.5 rounded-md bg-white p-0.5">
          <VerifiedBadge className="h-3.5 w-3.5" />
        </span>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ""
          if (file) void upload(file)
        }}
      />
    </div>
  )
}
