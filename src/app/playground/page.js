"use client";
 
import { useState } from "react";
import Modal from "@/playground/Modal";
import Tabs from "@/playground/Tabs";
import Disclosure from "@/playground/Disclosure";
 
export default function PlaygroundPage() {
  const [modalOpen, setModalOpen] = useState(false);
 
  const tabItems = [
    { id: "one", label: "Groceries", content: <p>Grocery tab content.</p> },
    { id: "two", label: "Errands", content: <p>Errand tab content.</p> },
    { id: "three", label: "Events", content: <p>Events tab content.</p> },
  ];
 
  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-bold mb-2">Modal</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-card"
        >
          Open modal
        </button>
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Example modal"
        >
          <p>This is the modal content. Try Tab and Escape.</p>
        </Modal>
      </section>
 
      <section>
        <h2 className="font-bold mb-2">Tabs</h2>
        <Tabs items={tabItems} />
      </section>
 
      <section>
        <h2 className="font-bold mb-2">Disclosure</h2>
        <Disclosure summary="More details">
          <p>This is the hidden content that shows when expanded.</p>
        </Disclosure>
      </section>
    </div>
  );
}