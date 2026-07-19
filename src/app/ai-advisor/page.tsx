"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card } from "@heroui/react";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  Send,
  User,
  Compass,
} from "lucide-react";

interface Message {
  role: "user" | "model";
  text: string;
}

export default function AiAdvisorPage(): React.JSX.Element {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Greetings. I am the Aetheris Space Curator. Consult me on the structural geometry, materials, and lighting of Bauhaus, Brutalist, Japandi, or Minimalist designs.",
    },
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/signin");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const parseInlineMarkdown = (text: string): React.ReactNode[] => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="text-[#dfb780] font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const renderMarkdown = (text: string): React.ReactNode[] => {
    const lines = text.split("\n");
    return lines.map((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("### ")) {
        return (
          <h4
            key={index}
            className="text-xs uppercase tracking-widest text-[#dfb780] font-bold mt-4 mb-2"
          >
            {trimmed.slice(4)}
          </h4>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h3
            key={index}
            className="text-sm uppercase tracking-widest text-[#dfb780] font-bold mt-4 mb-2"
          >
            {trimmed.slice(3)}
          </h3>
        );
      }
      if (trimmed.startsWith("# ")) {
        return (
          <h2
            key={index}
            className="text-base uppercase tracking-widest text-[#dfb780] font-light mt-4 mb-2"
          >
            {trimmed.slice(2)}
          </h2>
        );
      }
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return (
          <li
            key={index}
            className="list-disc list-inside text-neutral-400 pl-2 mt-1 font-light"
          >
            {parseInlineMarkdown(trimmed.slice(2))}
          </li>
        );
      }
      if (trimmed === "") {
        return <div key={index} className="h-2" />;
      }
      return (
        <p key={index} className="leading-relaxed mb-2 font-light text-xs md:text-sm">
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  const handleSend = async (textToSend: string): Promise<void> => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const chatHistory = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!res.ok) {
        throw new Error("Failed to process conversation.");
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        { role: "model", text: data.message || "No response received." },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: `Error: ${err.message || "Failed to contact design curator."}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const followUpPrompts = [
    "Tell me about Brutalism",
    "Optimize a small kitchen layout",
    "Explain Japandi material palette",
    "Classic Bauhaus structural rules",
  ];

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-[#040404] flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#dfb780] animate-spin" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium">
            Verifying Credentials...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040404] text-neutral-100 pt-28 pb-16 px-4 md:px-8 flex flex-col items-center">
      <div className="w-full max-w-4xl flex-1 flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-1">
            <Link
              href="/dashboard/user"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-500 hover:text-[#dfb780] transition mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Portal
            </Link>
            <h1 className="text-2xl md:text-3xl font-light uppercase tracking-[0.15em] flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-[#dfb780]" /> AI Advisor
            </h1>
            <p className="text-xs text-neutral-500 font-light">
              Consult with our autonomous spatial intelligence curator.
            </p>
          </div>
        </div>

        <Card className="flex-1 min-h-[500px] bg-[#0a0a0d] border border-white/[0.02] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role !== "user" && (
                    <div className="w-8 h-8 rounded-full border border-[#dfb780]/30 bg-[#dfb780]/5 flex items-center justify-center shrink-0 text-[#dfb780] text-xs font-serif italic">
                      Æ
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] p-4 rounded-2xl border text-neutral-300 ${
                      msg.role === "user"
                        ? "bg-[#dfb780]/5 border-[#dfb780]/20 text-[#dfb780]"
                        : "bg-white/[0.01] border-white/[0.02]"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p className="text-xs md:text-sm font-light leading-relaxed">
                        {msg.text}
                      </p>
                    ) : (
                      <div className="space-y-1">{renderMarkdown(msg.text)}</div>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center shrink-0 text-neutral-400">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 justify-start"
              >
                <div className="w-8 h-8 rounded-full border border-[#dfb780]/30 bg-[#dfb780]/5 flex items-center justify-center shrink-0 text-[#dfb780] text-xs font-serif italic">
                  Æ
                </div>
                <div className="flex items-center gap-1.5 px-4 py-3 bg-white/[0.01] border border-white/[0.02] rounded-2xl w-fit">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#dfb780] animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#dfb780] animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#dfb780] animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-white/[0.02] bg-[#07070a]/90 space-y-4">
            <div className="flex flex-wrap gap-2">
              {followUpPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-3 py-1.5 bg-white/[0.01] border border-white/5 hover:border-[#dfb780]/30 hover:bg-[#dfb780]/5 text-neutral-400 hover:text-white text-[10px] uppercase tracking-wider rounded-lg transition cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              className="flex gap-3"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInputValue(e.target.value)
                }
                placeholder="Ask our curator anything about spatial design..."
                className="flex-1 h-11 px-4 bg-zinc-900/30 border border-white/5 hover:border-white/10 focus:outline-none focus:border-[#dfb780] rounded-lg text-xs uppercase tracking-wider text-white placeholder-neutral-600 transition"
              />
              <Button
                type="submit"
                isPending={loading}
                className="h-11 px-5 bg-gradient-to-r from-[#dfb780] to-[#c2965d] hover:from-[#e7c79c] hover:to-[#dfb780] text-black text-xs font-bold uppercase tracking-widest rounded-lg transition shadow-md shadow-[#dfb780]/5 flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
