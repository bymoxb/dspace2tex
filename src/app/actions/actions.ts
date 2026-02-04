'use server';

import { toBibtex } from "../libs/bibtex/bibtex";
import { fetchMetaViaHtmlModeFull } from "../libs/dspace/html";
import { tryFetchItemByUuidViaRest, tryResolveHandleToItemMetaViaRest } from "../libs/dspace/rest";
import { extractHandleFromPath, extractUuidFromPath, isApiItemUrl, normalizeInputUrl } from "../libs/dspace/url";
import { fetchWithLimits } from "../libs/fetch/safeFetch";
import { extractDublinCoreFromItemJson } from "../libs/metadata/dc-json";

type ActionResult =
  | { ok: true; bibtex: string; meta: Record<string, string[]>; source: 'dspace-rest' | 'dspace-html' }
  | { ok: false; error: string };

// -------------------- Server Action principal --------------------
export async function convertDspaceToBibtex(_prevState: any, formData: FormData): Promise<ActionResult> {
  const rawUrl = String(formData.get('url') ?? '').trim();
  if (!rawUrl) return { ok: false, error: 'URL is empty.' };

  let u: URL;
  try {
    u = normalizeInputUrl(rawUrl);
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Invalid URL.' };
  }

  try {
    // 1) If it's already an API item URL (DSpace 7)
    if (isApiItemUrl(u)) {
      const { text } = await fetchWithLimits(u, 'json');
      const meta = extractDublinCoreFromItemJson(JSON.parse(text));
      if (!Object.keys(meta).some(k => k.startsWith('dc.'))) {
        return { ok: false, error: 'The API responded but no metadata was found in the item.' };
      }
      return { ok: true, bibtex: toBibtex(meta), meta, source: 'dspace-rest' };
    }

    // 2) If it's /items/<uuid> (DSpace 7 UI) => use REST item
    const uuid = extractUuidFromPath(u.pathname);
    if (uuid) {
      const meta = await tryFetchItemByUuidViaRest(u, uuid);
      if (!meta) {
        return {
          ok: false,
          error:
            'Detected /items/<uuid> but could not retrieve the item via REST (/server/api or /api).',
        };
      }
      return { ok: true, bibtex: toBibtex(meta), meta, source: 'dspace-rest' };
    }

    // 3) If it's /handle/<h>, try REST first (DSpace 7), then HTML (DSpace 6)
    const handle = extractHandleFromPath(u.pathname);
    if (handle) {
      const metaViaRest = await tryResolveHandleToItemMetaViaRest(u, handle);
      if (metaViaRest) {
        return { ok: true, bibtex: toBibtex(metaViaRest), meta: metaViaRest, source: 'dspace-rest' };
      }

      // fallback HTML mode=full (DSpace 6 / JSPUI)
      const metaViaHtml = await fetchMetaViaHtmlModeFull(u);
      return { ok: true, bibtex: toBibtex(metaViaHtml), meta: metaViaHtml, source: 'dspace-html' };
    }

    return {
      ok: false,
      error:
        'URL not yet supported. Use a /handle/<id>/<id> link (DSpace 6/7), /items/<uuid> (DSpace 7), or a /server/api/core/items/<uuid> endpoint.',
    };
  } catch (e: any) {
    const msg =
      e?.name === 'AbortError'
        ? 'Request timed out while querying the repository.'
        : (e?.message || 'Error processing the URL.');
    return { ok: false, error: msg };
  }
}
