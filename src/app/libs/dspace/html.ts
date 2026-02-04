import { fetchWithLimits } from "../fetch/safeFetch";
import { extractDublinCoreFromModeFull } from "../metadata/dc-html";
import { extractHandleFromPath, forceModeFull } from "./url";

// -------------------- Fallback DSpace 6 JSPUI (HTML) --------------------
export async function fetchMetaViaHtmlModeFull(u: URL) {
    // exígele /handle/ para este camino
    const handle = extractHandleFromPath(u.pathname);
    if (!handle) throw new Error('Para HTML (DSpace 6) se requiere URL /handle/...');

    const modeFull = forceModeFull(u);
    const { text: html } = await fetchWithLimits(modeFull, 'html');
    const meta = extractDublinCoreFromModeFull(html);

    if (!Object.keys(meta).some(k => k.startsWith('dc.'))) {
        throw new Error('No pude extraer metadatos Dublin Core desde HTML (mode=full).');
    }
    return meta;
}