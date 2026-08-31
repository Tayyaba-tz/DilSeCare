"use client";
 
import { useState } from "react";
 
interface DisclosureProps {
  summary: string;
  children: React.ReactNode;
}
 
export default function Disclosure({ summary, children }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = "disclosure-panel";
 
  return (
    <div>
      <button
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 font-bold text-primary"
      >
        <span>{isOpen ? "▼" : "▶"}</span>
        {summary}
      </button>
      <div id={panelId} hidden={!isOpen} className="p-3">
        {children}
      </div>
    </div>
  );
}