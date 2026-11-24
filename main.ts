// Seventeen Syllables of Debugging
// A tiny program with one job: write a single haiku about debugging
// to entry.txt in the output directory.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The haiku itself, kept as three separate lines so the shape
// (three lines, nothing more) stays obvious when reading the code.
// Syllables, counted word by word:
//   line 1: Past(1) three(1) cur-sor(2) blinks(1)            = 5
//   line 2: a(1) red(1) log(1) line(1) names(1) the(1) fault(1) = 7
//   line 3: just(1) one(1) com-ma(2) wrong(1)                = 5
const haikuLines: string[] = [
  "Past three, cursor blinks",
  "a red log line names the fault",
  "just one comma wrong",
];

const entryText: string = haikuLines.join("\n");

// Self-checks before anything touches disk. The bounty asks for
// plain text, three lines, and no more than 200 characters total.
function checkEntry(text: string): void {
  if (text.length < 1 || text.length > 200) {
    throw new Error(
      `entry must be 1-200 characters, got ${text.length}`,
    );
  }
  const lineCount = text.split("\n").length;
  if (lineCount !== 3) {
    throw new Error(`entry must have exactly 3 lines, got ${lineCount}`);
  }
}

// Read the file back after writing and confirm it holds exactly the
// intended text. A short or altered write (full disk, odd filesystem)
// would otherwise pass silently and ship a broken entry.
function verifyWrittenFile(target: string, expected: string): void {
  const written = readFileSync(target, "utf-8");
  if (written !== expected) {
    throw new Error(
      `written file does not match the intended entry: ` +
        `expected ${expected.length} characters, read back ${written.length}`,
    );
  }
}

function resolveOutputDir(): string {
  const fromEnv = process.env.OUTPUT_DIR;
  if (typeof fromEnv === "string" && fromEnv.length > 0) {
    return fromEnv;
  }
  return "/output";
}

function main(): void {
  checkEntry(entryText);

  const outDir = resolveOutputDir();
  // Create the directory if needed. Never remove it: on the grading
  // runner it may be a mounted volume, so deleting it would fail.
  mkdirSync(outDir, { recursive: true });

  const target = join(outDir, "entry.txt");
  writeFileSync(target, entryText, "utf-8");
  verifyWrittenFile(target, entryText);
  console.log(`wrote ${entryText.length} characters to ${target}`);
}

main();
