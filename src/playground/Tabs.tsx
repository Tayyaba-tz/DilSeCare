"use client";
 
import { useRef, useState, KeyboardEvent } from "react";
 
interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}
 
interface TabsProps {
  items: TabItem[];
}
 
export default function Tabs({ items }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
 
  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    let newIndex = activeIndex;
 
    if (e.key === "ArrowRight") {
      newIndex = (activeIndex + 1) % items.length;
    } else if (e.key === "ArrowLeft") {
      newIndex = (activeIndex - 1 + items.length) % items.length;
    } else if (e.key === "Home") {
      newIndex = 0;
    } else if (e.key === "End") {
      newIndex = items.length - 1;
    } else {
      return;
    }
 
    e.preventDefault();
    setActiveIndex(newIndex);
    tabRefs.current[newIndex]?.focus();
  }
 
  return (
    <div>
      <div role="tablist" aria-label="Playground tabs" className="flex gap-2 border-b">
        {items.map((item, index) => (
          <button
            key={item.id}
            ref={(el) => { tabRefs.current[index] = el; }}
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={activeIndex === index}
            aria-controls={`panel-${item.id}`}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={handleKeyDown}
            className={`px-3 py-2 ${activeIndex === index ? "border-b-2 border-primary font-bold" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, index) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`panel-${item.id}`}
          aria-labelledby={`tab-${item.id}`}
          hidden={activeIndex !== index}
          tabIndex={0}
          className="p-4"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}