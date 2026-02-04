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
  if (!rawUrl) return { ok: false, error: 'URL vacía.' };

  let u: URL;
  try {
    u = normalizeInputUrl(rawUrl);
  } catch (e: any) {
    return { ok: false, error: e?.message || 'URL inválida.' };
  }

  try {
    // 1) Si ya es API item URL (DSpace 7)
    if (isApiItemUrl(u)) {
      const { text } = await fetchWithLimits(u, 'json');
      const meta = extractDublinCoreFromItemJson(JSON.parse(text));
      if (!Object.keys(meta).some(k => k.startsWith('dc.'))) {
        return { ok: false, error: 'La API respondió pero no encontré metadatos en el item.' };
      }
      return { ok: true, bibtex: toBibtex(meta), meta, source: 'dspace-rest' };
    }

    // 2) Si es /items/<uuid> (DSpace 7 UI) => usar REST item
    const uuid = extractUuidFromPath(u.pathname);
    if (uuid) {
      const meta = await tryFetchItemByUuidViaRest(u, uuid);
      if (!meta) {
        return {
          ok: false,
          error:
            'Detecté /items/<uuid> pero no pude obtener el item vía REST (/server/api o /api).',
        };
      }
      return { ok: true, bibtex: toBibtex(meta), meta, source: 'dspace-rest' };
    }

    // 3) Si es /handle/<h> intenta primero REST (DSpace 7), luego HTML (DSpace 6)
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
        'URL no soportada aún. Usa un link /handle/<id>/<id> (DSpace 6/7) o /items/<uuid> (DSpace 7) o un endpoint /server/api/core/items/<uuid>.',
    };
  } catch (e: any) {
    const msg =
      e?.name === 'AbortError'
        ? 'Tiempo de espera agotado al consultar el repositorio.'
        : (e?.message || 'Error procesando la URL.');
    return { ok: false, error: msg };
  }
}
