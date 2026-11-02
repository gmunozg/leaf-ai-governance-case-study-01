"use client";

import { useEffect } from "react";
import { mountPlate } from "@/lib/plate-runtime";

/** The continuous botanical plate behind the home page (decorative, aria-hidden). */
export function BotanicalPlate() {
  useEffect(() => mountPlate(), []);
  return null;
}
