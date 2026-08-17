/**
 * Geometry for the Hamzify mark, in a 32×32 box.
 *
 * Kept here as data so the header logo, the favicon, the app icons and the
 * social cards all draw the same shape from one source instead of five
 * hand-copied path strings that drift apart.
 *
 * The mark is an H whose right stem has opened out into a chevron, with a node
 * on the seam where the crossbar meets it.
 */

/** Left stem and crossbar. Takes the foreground colour. */
export const MARK_H = "M5 5.5h5v21H5zM10 13.5h6v5h-6z";

/** The chevron that replaces the right stem. Takes the accent colour. */
export const MARK_CHEVRON =
  "M16.8 16 27.5 5.3V11.3L22.8 16l4.7 4.7v6z";

/** The node on the seam. */
export const MARK_NODE = { cx: 16, cy: 16, r: 2.5 } as const;
