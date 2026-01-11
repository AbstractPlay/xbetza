import type { Modifiers } from "../types";

export function parseModifiers(raw: string): Modifiers {
  const mods: Modifiers = {};
  for (const ch of raw) {
    if ("tuoxy pzghmc".includes(ch)) mods[ch as keyof Modifiers] = true;
    else throw new Error(`Unknown modifier: ${ch}`);
  }
  return mods;
}
