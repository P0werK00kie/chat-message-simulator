import type { Message } from "./message"

export type ParticipantStatus = "online" | "offline" | "typing" | "empty"

export interface ParticipantLocation {
  address: string
  lat: number
  lng: number
}

export interface Participant {
  id: string
  name: string
  username?: string
  avatarUrl?: string
  isVerified?: boolean
  status: ParticipantStatus
  color: string
  lastActive?: string
  location?: ParticipantLocation
}

export interface ConversationMetadata {
  createdAt: string
  updatedAt: string
}

export interface Conversation {
  id: string
  participants: Participant[]
  messages: Message[]
  metadata: ConversationMetadata
  groupName?: string
}
