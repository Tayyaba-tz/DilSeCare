"use client";
 
import Link from "next/link";
import { useState } from "react";
 
const links = [
  { href: "/", label: "Splash" },
  { href: "/login", label: "Login" },
  { href: "/home", label: "Home" },
  { href: "/grocery", label: "Grocery" },
  { href: "/errand", label: "Errand" },
  { href: "/events", label: "Events" },
  { href: "/checkout", label: "Checkout" },
  { href: "/tracking", label: "Tracking" },
  { href: "/settings", label: "Settings" },
  { href: "/health", label: "Health" },
];
 
export default function Navbar() {
  const [open, setOpen] = useState(false);
 
  return (
    <nav className="bg-primary text-white px-4 py-3">
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg">DilSeCare</span>
        <button
          className="sm:hidden"
          onClick={() => setOpen(!open)}
        >
          Menu
        </button>
        <div className="hidden sm:flex gap-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
        </div>
      </div>
      {open && (
        <div className="sm:hidden flex flex-col gap-2 mt-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
        </div>
      )}
    </nav>
  );
}