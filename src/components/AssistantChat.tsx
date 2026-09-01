"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import OrderEstimateCard, { OrderEstimateCardProps } from "./OrderEstimateCard";

const SUGGESTIONS = [
    "Estimate groceries for Ammi this week: 2kg rice, cooking oil, a dozen eggs — deliver to Lahore",
    "What can I send for Eid this year?",
    "How does DilSeCare grocery delivery work?",
];

export default function AssistantChat() {
    const { messages, sendMessage, status, stop, error } = useChat({
        transport: new DefaultChatTransport({ api: "/api/chat" }),
    });

    const [input, setInput] = useState("");
    const lastUserTextRef = useRef("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const [pinnedToBottom, setPinnedToBottom] = useState(true);

    // --- Auto-scroll that respects the user scrolling up ---
    useEffect(() => {
        if (pinnedToBottom && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, pinnedToBottom]);

    function handleScroll() {
        const el = scrollRef.current;
        if (!el) return;
        const distanceFromBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight;
        setPinnedToBottom(distanceFromBottom < 40);
    }

    function jumpToLatest() {
        setPinnedToBottom(true);
    }

    function handleSend(text: string) {
        const trimmed = text.trim();
        if (!trimmed) return;
        lastUserTextRef.current = trimmed;
        sendMessage({ text: trimmed });
        setInput("");
        setPinnedToBottom(true);
    }

    function retryLastMessage() {
        if (lastUserTextRef.current) {
            sendMessage({ text: lastUserTextRef.current });
        }
    }

    const isThinking = status === "submitted";
    const isStreaming = status === "streaming";

    return (
        <div className="flex flex-col h-[70vh] bg-white rounded-card shadow">
            {/* Messages */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-3"
            >
                {messages.length === 0 && (
                    <div className="text-sm text-gray-500">
                        <p className="mb-2">No conversation yet — try asking:</p>
                        <div className="flex flex-col gap-2">
                            {SUGGESTIONS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => handleSend(s)}
                                    className="text-left text-sm bg-cream border rounded-card px-3 py-2 hover:bg-gray-50"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={
                            message.role === "user"
                                ? "ml-auto max-w-[80%] bg-primary text-white rounded-card px-3 py-2"
                                : "mr-auto max-w-[80%] bg-cream rounded-card px-3 py-2"
                        }
                    >
                        {message.parts.map((part, i) => {
                            if (part.type === "text") {
                                return <span key={i}>{part.text}</span>;
                            }

                            if (part.type === "tool-estimateOrder") {
                                switch (part.state) {
                                    case "input-streaming":
                                        return (
                                            <div key={i} className="text-xs italic opacity-70">
                                                Working out what you need…
                                            </div>
                                        );
                                    case "input-available":
                                        return (
                                            <div key={i} className="text-xs italic opacity-70">
                                                Calculating your order estimate…
                                            </div>
                                        );
                                    case "output-available":
                                        return (
                                            <OrderEstimateCard
                                                key={i}
                                                {...(part.output as OrderEstimateCardProps)}
                                            />
                                        );
                                    case "output-error":
                                        return (
                                            <div key={i} className="text-xs text-red-600">
                                                Couldn't calculate that estimate: {part.errorText}
                                            </div>
                                        );
                                    default:
                                        return null;
                                }
                            }

                            return null;
                        })}
                    </div>
                ))}

                {isThinking && (
                    <div className="mr-auto max-w-[80%] bg-cream rounded-card px-3 py-2 text-sm italic text-gray-500">
                        Thinking…
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-card px-3 py-2 text-sm text-red-700 flex items-center justify-between gap-2">
                        <span>Something went wrong sending that message.</span>
                        <button
                            onClick={retryLastMessage}
                            className="bg-red-600 text-white text-xs px-2 py-1 rounded"
                        >
                            Retry
                        </button>
                    </div>
                )}
            </div>

            {!pinnedToBottom && (
                <button
                    onClick={jumpToLatest}
                    className="self-center mb-2 text-xs bg-primary text-white px-3 py-1 rounded-full"
                >
                    Jump to latest ↓
                </button>
            )}

            {/* Input bar */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSend(input);
                }}
                className="border-t p-3 flex gap-2"
            >
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about groceries, errands, or events…"
                    className="flex-1 border rounded-card px-3 py-2 text-sm"
                    disabled={isStreaming}
                />
                {isStreaming ? (
                    <button
                        type="button"
                        onClick={stop}
                        className="bg-gray-700 text-white px-4 py-2 rounded-card text-sm"
                    >
                        Stop
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="bg-primary text-white px-4 py-2 rounded-card text-sm disabled:opacity-40"
                    >
                        Send
                    </button>
                )}
            </form>
        </div>
    );
}