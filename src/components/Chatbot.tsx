import { useState, useRef, useEffect } from "react"
import { MessageCircle, Send } from "lucide-react"
import type { Locale } from "@/data/content"
import { content } from "@/data/content"

type Message = { role: "user" | "bot"; text: string }

export function Chatbot({ lang }: { lang: Locale }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const listRef = useRef<HTMLDivElement>(null)
  const t = content[lang].chatbot

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "bot", text: t.welcome }])
    }
  }, [open, messages.length, t.welcome])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    setInput("")
    setMessages((prev) => [...prev, { role: "user", text }])
    setMessages((prev) => [...prev, { role: "bot", text: t.defaultReply }])
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] shadow-lg transition hover:bg-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        aria-label="Open assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex w-[320px] flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl">
          <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
            <span className="font-display text-sm font-semibold text-[var(--color-text)]">
              {t.title}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-text)]"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div
            ref={listRef}
            className="flex min-h-[200px] max-h-[280px] flex-1 flex-col gap-3 overflow-y-auto p-4"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.role === "user"
                    ? "ml-8 rounded-lg rounded-tr-sm bg-[var(--color-accent)] px-3 py-2 text-sm text-[var(--color-bg)]"
                    : "mr-8 rounded-lg rounded-tl-sm bg-[var(--color-border)]/50 px-3 py-2 text-sm text-[var(--color-text)]"
                }
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex shrink-0 gap-2 border-t border-[var(--color-border)] p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={t.placeholder}
              className="min-w-0 flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              aria-label="Chat message"
            />
            <button
              type="button"
              onClick={handleSend}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--color-accent)] text-[var(--color-bg)] transition hover:bg-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              aria-label={t.send}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
