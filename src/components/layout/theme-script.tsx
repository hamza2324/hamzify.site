export const THEME_STORAGE_KEY = "hamzify-theme";

/**
 * Applies the saved theme before first paint so there is no flash of the wrong
 * palette. When the stored value is `system` (or missing) no attribute is set,
 * which lets the `color-scheme: light dark` declaration in `globals.css` follow
 * the operating system on its own.
 *
 * This is the one place where `dangerouslySetInnerHTML` is justified: the string
 * is a constant with no interpolation of external data.
 */
const script = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
