"use client";

import { Plus } from "lucide-react";
import { getFaq } from "@/config/faq";
import { track } from "@/lib/analytics";

export default function Faq() {
  const faq = getFaq();
  return (
    <div className="divide-y divide-white/8 border-y border-white/8">
      {faq.map((f, i) => (
        <details
          key={f.q}
          className="group"
          onToggle={(e) => (e.currentTarget as HTMLDetailsElement).open && track("faq_open", { question_index: i + 1 })}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-[1.08rem] font-semibold transition-colors hover:text-volt sm:text-[1.2rem] [&::-webkit-details-marker]:hidden">
            {f.q}
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/15 transition-transform duration-500 ease-[var(--ease-out-expo)] group-open:rotate-45 group-open:border-volt group-open:bg-volt group-open:text-ink">
              <Plus className="size-4" />
            </span>
          </summary>
          <p className="fade-up max-w-3xl pb-7 pr-14 leading-relaxed text-steel">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
