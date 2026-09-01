"use client";
 
import { useEffect } from "react";
 
export default function AssistantError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
 
  return (
    <div className="bg-white rounded-card shadow p-6 text-center">
      <h2 className="text-lg font-bold text-primary mb-2">
        Something went wrong loading the Assistant
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Try again — if it keeps happening, come back later.
      </p>
      <button
        onClick={reset}
        className="bg-primary text-white px-4 py-2 rounded-card text-sm"
      >
        Try again
      </button>
    </div>
  );
}