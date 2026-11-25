// SPDX-License-Identifier: MIT
// One-Line Laugh-Off — a single joke, written to /output/entry.txt.
//
// The joke is built from two colliding frames: a calendar (a tool for
// planning the future) and a funeral (the one appointment nobody plans
// to attend). The punchline reframes "committing" — the word does double
// duty as RSVP-ing and as committing to a life decision — so the narrator
// dodges even his own funeral the way he dodges every other commitment.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// The entry itself: one line, no setup notes, no explanation.
const JOKE =
  "My calendar invited me to my own funeral, so I RSVP'd 'maybe' — I still hate committing to things.";

// The gate in RULES.txt: UTF-8 text, 1 to 200 characters, not only whitespace.
const GATE_MIN = 1;
const GATE_MAX = 200;

function gate(line: string): string {
  const trimmed = line.trim();
  if (trimmed.length < GATE_MIN) {
    throw new Error("entry is empty");
  }
  if ([...line].length > GATE_MAX) {
    throw new Error(`entry is ${[...line].length} characters, over the 200 cap`);
  }
  if (trimmed.length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (line.includes("\n")) {
    throw new Error("entry must be a single line");
  }
  return line;
}

function outputPath(): string {
  // The grader mounts a writable /output; allow an override for local runs.
  const override = process.env.OUTPUT_PATH ?? process.env.ENTRY_OUTPUT;
  if (override) return override;
  const dir = process.env.OUTPUT_DIR ?? "/output";
  return join(dir, "entry.txt");
}

function main(): void {
  const line = gate(JOKE);
  const target = outputPath();
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, line, "utf8");
  // Read back what was written: the grader gates the file, not the string
  // in memory, so a mismatch here must fail loudly instead of passing.
  const written = readFileSync(target, "utf8");
  if (written !== line) {
    throw new Error("written entry does not match the gated line");
  }
  console.log(`wrote ${[...line].length} characters to ${target}`);
}

main();
