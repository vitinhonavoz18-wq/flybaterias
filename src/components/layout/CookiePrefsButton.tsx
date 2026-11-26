"use client";

import { openConsent } from "@/lib/consent";

export default function CookiePrefsButton() {
  return (
    <button type="button" onClick={openConsent} className="hover:text-white">
      Preferências de cookies
    </button>
  );
}
