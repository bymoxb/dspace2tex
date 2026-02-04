import { cleanText } from "../text";

// -------------------- DC JSON (DSpace 7 REST items) --------------------
export function extractDublinCoreFromItemJson(item: any): Record<string, string[]> {
    // DSpace 7 suele traer `metadata` como objeto: { "dc.title": [{value: "..."}], ... }
    const meta: Record<string, string[]> = {};
    const md = item?.metadata;

    if (!md || typeof md !== 'object') return meta;

    for (const [key, arr] of Object.entries(md)) {
        if (!key.startsWith('dc.')) continue;
        if (!Array.isArray(arr)) continue;

        for (const entry of arr as any[]) {
            const v = entry?.value;
            if (typeof v === 'string' && v.trim()) {
                (meta[key] ||= []).push(cleanText(v));
            }
        }
    }
    return meta;
}