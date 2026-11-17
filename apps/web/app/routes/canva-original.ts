import originalHtml from "../original/maison-sillage.html?raw"

// Preserve the exported document and its existing route. Local styles and
// enhancement scripts share its catalog and wishlist without React hydration.
export function loader() {
  return new Response(originalHtml, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })
}
