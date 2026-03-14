"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Copy, RotateCcw, ArrowRight } from "lucide-react";
import type { Session, Message } from "@/lib/types";
import { providerColors } from "@/lib/models/catalog";

interface ChatPanelProps {
  session: Session;
  onInsertPrompt?: string;
  onSendMessage?: (content: string) => void | Promise<void>;
  /** Called when user wants to hand off context to another model */
  onHandoff?: (contextMessages: Message[]) => void;
}

export function ChatPanel({
  session,
  onInsertPrompt,
  onSendMessage,
  onHandoff,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session.messages]);

  useEffect(() => {
    if (onInsertPrompt) {
      setInput(onInsertPrompt);
      inputRef.current?.focus();
    }
  }, [onInsertPrompt]);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const resetTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleSubmit = async () => {
    const value = input.trim();
    if (!value || !onSendMessage) return;

    setInput("");
    resetTextareaHeight();

    await onSendMessage(value);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-7">
          {session.messages.map((message, i) => (
            <div
              key={message.id}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {message.role === "user" ? (
                <div className="flex justify-end">
                  <div className="max-w-[80%]">
                    <div className="px-4 py-3 rounded-2xl rounded-tr-sm bg-accent-subtle text-[13px] leading-[1.7]">
                      {message.content}
                    </div>
                    <div className="text-[10px] text-muted-2 mt-1 text-right">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ) : message.model === "Symphony" ? (
                <div className="flex justify-center py-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-border text-[11px] text-muted">
                    <ArrowRight size={11} className="text-accent" />
                    {message.content}
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-md bg-surface-2 flex items-center justify-center shrink-0 mt-0.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: providerColors[session.model.provider],
                      }}
                    />
                  </div>
                  <div className="max-w-[85%] min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[11px] font-medium text-muted">
                        {message.model}
                      </span>
                    </div>
                    <div className="text-[13px] leading-[1.75] whitespace-pre-wrap">
                      {message.content
                        ? renderContent(message.content)
                        : null}
                      {message.status === "streaming" && (
                        <span className="inline-block w-[5px] h-[14px] bg-accent/70 ml-0.5 align-middle animate-pulse rounded-sm" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2.5">
                      <span className="text-[10px] text-muted-2">
                        {message.status === "streaming"
                          ? "Responding…"
                          : formatTime(message.timestamp)}
                      </span>
                      {message.status !== "streaming" && (
                      <div className="flex items-center gap-1">
                        <button className="w-6 h-6 rounded flex items-center justify-center text-muted-2 hover:text-foreground hover:bg-surface-2 transition-colors cursor-pointer">
                          <Copy size={12} />
                        </button>
                        <button className="w-6 h-6 rounded flex items-center justify-center text-muted-2 hover:text-foreground hover:bg-surface-2 transition-colors cursor-pointer">
                          <RotateCcw size={12} />
                        </button>
                        {onHandoff && (
                          <button
                            onClick={() => {
                              const idx = session.messages.findIndex(
                                (m) => m.id === message.id
                              );
                              onHandoff(session.messages.slice(0, idx + 1));
                            }}
                            className="group/handoff h-6 rounded flex items-center gap-1 px-1.5 text-muted-2 hover:text-accent hover:bg-accent-subtle transition-colors cursor-pointer"
                            title="Hand off to another model"
                          >
                            <ArrowRight size={12} />
                            <span className="text-[10px] font-medium hidden group-hover/handoff:inline">
                              Hand off
                            </span>
                          </button>
                        )}
                      </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="px-6 pb-5 pt-1">
        <div className="max-w-2xl mx-auto">
          <div className="relative flex items-end gap-2.5 rounded-xl border border-border bg-surface p-2.5 focus-within:border-accent/30 transition-colors">
            <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-2 hover:text-foreground hover:bg-surface-2 transition-colors shrink-0 cursor-pointer">
              <Paperclip size={15} />
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message..."
              rows={1}
              className="flex-1 bg-transparent outline-none text-[13px] resize-none leading-relaxed max-h-36 py-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSubmit();
                }
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
            <button
              onClick={() => void handleSubmit()}
              disabled={!input.trim()}
              className={`w-7 h-7 rounded-md flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                input.trim()
                  ? "bg-accent text-white"
                  : "bg-surface-2 text-muted-2"
              }`}
            >
              <Send size={14} />
            </button>
          </div>
          <div className="text-center mt-2 text-[10px] text-muted-2/60">
            Demo workspace — no data is stored or sent
          </div>
        </div>
      </div>
    </div>
  );
}

function renderContent(content: string) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      const lines = part.slice(3, -3).split("\n");
      const lang = lines[0]?.trim();
      const code = lang ? lines.slice(1).join("\n") : lines.join("\n");
      return (
        <pre key={i} className="my-3 text-[12px] !bg-surface-2 !border-border">
          {lang && (
            <div className="text-[10px] text-muted-2 uppercase tracking-[0.08em] mb-2 flex items-center justify-between">
              <span>{lang}</span>
              <button className="text-muted-2 hover:text-foreground transition-colors cursor-pointer">
                <Copy size={11} />
              </button>
            </div>
          )}
          <code>{code}</code>
        </pre>
      );
    }

    const segments = part.split(/(\*\*[^*]+\*\*)/g);
    return segments.map((seg, j) => {
      if (seg.startsWith("**") && seg.endsWith("**")) {
        return (
          <strong key={`${i}-${j}`} className="font-semibold text-foreground">
            {seg.slice(2, -2)}
          </strong>
        );
      }
      return seg;
    });
  });
}