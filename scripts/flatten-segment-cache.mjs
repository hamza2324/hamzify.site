import { readdirSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

/**
 * Post-export fix for Next's client segment cache on a static host.
 *
 * Next 16 prefetches individual route segments. The router requests them with the
 * segment path dot-joined into a single filename:
 *
 *   GET /latest/__next.!KHNpdGUp.latest.__PAGE__.txt
 *
 * but `next build` with `output: "export"` writes that payload as a nested
 * directory instead:
 *
 *   out/latest/__next.!KHNpdGUp/latest/__PAGE__.txt
 *
 * A static host has no way to map one onto the other, so every prefetch 404s —
 * visible as console errors on link hover, and on GitHub Pages as a full 404
 * page downloaded per hover. Flattening the nested files to the names the router
 * actually asks for makes prefetching work as intended.
 *
 * Runs as part of `npm run build`. If a future Next release exports these files
 * flat, the walk simply finds nothing to move.
 */

const OUT = "out";
const SEGMENT_DIR = /^__next\./;

let moved = 0;

/** Every file below `dir`, as paths relative to it. */
function filesUnder(dir) {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...filesUnder(full));
    else found.push(full);
  }
  return found;
}

function flatten(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = join(dir, entry.name);

    if (SEGMENT_DIR.test(entry.name)) {
      for (const file of filesUnder(full)) {
        const suffix = relative(full, file).split(sep).join(".");
        renameSync(file, join(dir, `${entry.name}.${suffix}`));
        moved += 1;
      }
      rmSync(full, { recursive: true });
      continue;
    }

    flatten(full);
  }
}

try {
  statSync(OUT);
} catch {
  console.error(`flatten-segment-cache: no ${OUT}/ directory — run next build first.`);
  process.exit(1);
}

flatten(OUT);
writeFileSync(join(OUT, ".nojekyll"), "");
console.log(`flatten-segment-cache: flattened ${moved} segment payload(s).`);
