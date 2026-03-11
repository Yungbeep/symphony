"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Sparkles } from "lucide-react";
import type { Session } from "@/lib/types";
import { providerColors } from "@/lib/data";

interface ChatPanelProps {
  session: Session;
  onInsertPrompt?: string;
}

export function ChatPanel({ session, onInsertPrompt }: ChatPanelProps) {
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

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {session.messages.map((message, i) => (
            <div
              key={message.id}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {message.role === "user" ? (
                <div className="flex justify-end">
                  <div className="max-w-[85%]">
                    <div className="px-4 py-3 rounded-2xl rounded-tr-md bg-accent/10 text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div className="text-[11px] text-muted/50 mt-1.5 text-right">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-surface-2 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={14} className="text-accent" />
                  </div>
                  <div className="max-w-[85%] min-w-0">
                    <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-surface border border-border text-sm leading-relaxed whitespace-pre-wrap">
                      {renderContent(message.content)}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] text-muted/50">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.model && (
                        <span className="text-[11px] text-muted/40 flex items-center gap-1">
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              background:
                                providerColors[session.model.provider],
                            }}
                          />
                          {message.model}
                        </span>
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
      <div className="px-6 pb-6 pt-2">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-3 rounded-xl border border-border bg-surface p-3 focus-within:border-accent/40 transition-colors">
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-2 transition-colors shrink-0 cursor-pointer">
              <Paperclip size={16} />
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Symphony..."
              rows={1}
              className="flex-1 bg-transparent outline-none text-sm resize-none leading-relaxed max-h-40 py-1.5"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  // Would send message here
                }
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
            <button
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                input.trim()
                  ? "bg-accent text-white shadow-lg shadow-accent/20"
                  : "bg-surface-2 text-muted"
              }`}
            >
              <Send size={16} />
            </button>
          </div>
          <div className="flex items-center justify-center mt-2.5 text-[11px] text-muted/40">
            Symphony does not store or send data. This is a workspace demo.
          </div>
        </div>
      </div>
    </div>
  );
}

/** Simple renderer that handles code blocks in message content */
function renderContent(content: string) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      const lines = part.slice(3, -3).split("\n");
      const lang = lines[0]?.trim();
      const code = lang ? lines.slice(1).join("\n") : lines.join("\n");
      return (
        <pre key={i} className="my-3 text-xs">
          {lang && (
            <div className="text-[10px] text-muted/50 uppercase tracking-wider mb-2">
              {lang}
            </div>
          )}
          <code>{code}</code>
        </pre>
      );
    }

    // Handle inline markdown bold
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
