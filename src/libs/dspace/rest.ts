import { fetchWithLimits } from "../fetch/safeFetch";
import { extractDublinCoreFromItemJson } from "../metadata/dc-json";
import { API_PREFIX_CANDIDATES, buildApiUrl } from "./url";

// -------------------- Resolver DSpace 7 REST (si existe) --------------------
export async function tryFetchItemByUuidViaRest(base: URL, uuid: string) {
    for (const prefix of API_PREFIX_CANDIDATES) {
        const itemUrl = buildApiUrl(base, prefix, `/core/items/${uuid}`);
        try {
            const { text } = await fetchWithLimits(itemUrl, 'json');
            const json = JSON.parse(text);
            const meta = extractDublinCoreFromItemJson(json);
            if (Object.keys(meta).some(k => k.startsWith('dc.'))) return meta;
        } catch {
            // intenta siguiente prefix
        }
    }
    return null;
}

export async function tryResolveHandleToItemMetaViaRest(base: URL, handle: string) {
    for (const prefix of API_PREFIX_CANDIDATES) {
        const handleUrl = buildApiUrl(base, prefix, `/core/handles/${handle}`);
        try {
            const { text } = await fetchWithLimits(handleUrl, 'json');
            const json = JSON.parse(text);

            // En DSpace 7 handle suele traer _links.resource.href apuntando al item
            const href: string | undefined =
                json?._links?.resource?.href ||
                json?._links?.item?.href ||
                json?._links?.self?.href;

            // Si nos dio directamente el item (raro), intenta usar metadata
            const directMeta = extractDublinCoreFromItemJson(json);
            if (Object.keys(directMeta).some(k => k.startsWith('dc.'))) return directMeta;

            if (!href || typeof href !== 'string') continue;

            // href puede venir como URL absoluta al API (/server/api/...)
            const itemUrl = new URL(href, base.origin);
            const { text: itemText } = await fetchWithLimits(itemUrl, 'json');
            const itemJson = JSON.parse(itemText);
            const meta = extractDublinCoreFromItemJson(itemJson);

            if (Object.keys(meta).some(k => k.startsWith('dc.'))) return meta;
        } catch {
            // intenta siguiente prefix
        }
    }
    return null;
}