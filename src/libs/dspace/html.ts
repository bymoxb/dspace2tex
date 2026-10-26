import { fetchWithLimits } from "../fetch/safeFetch";
import { extractDublinCoreFromModeFull } from "../metadata/dc-html";
import { extractHandleFromPath, forceModeFull } from "./url";

// -------------------- Fallback DSpace 6 JSPUI (HTML) --------------------
export async function fetchMetaViaHtmlModeFull(u: URL) {
    // Requires /handle/ for this path
    const handle = extractHandleFromPath(u.pathname);
    if (!handle) throw new Error('A /handle/... URL is required for HTML mode (DSpace 6).');

    const modeFull = forceModeFull(u);
    const { text: html } = await fetchWithLimits(modeFull, 'html');
    const meta = extractDublinCoreFromModeFull(html);

    if (!Object.keys(meta).some(k => k.startsWith('dc.'))) {
        throw new Error('Could not extract Dublin Core metadata from HTML (mode=full).');
    }
    return meta;
}