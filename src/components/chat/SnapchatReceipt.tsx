import type { Message } from "@/types/message"
import { ReceiptPill } from "@/components/chat/ReceiptPill"

export const SnapchatReceipt = ({ message, isOwn }: { message: Message; isOwn: boolean }) => (
  <ReceiptPill message={message} isOwn={isOwn} accentColor="var(--bubble-received)" />
)
