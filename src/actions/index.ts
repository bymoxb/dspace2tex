import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { extractHandleFromPath, extractUuidFromPath, isApiItemUrl, normalizeInputUrl } from '../libs/dspace/url';
import { fetchWithLimits } from '../libs/fetch/safeFetch';
import { extractDublinCoreFromItemJson } from '../libs/metadata/dc-json';
import { toBibtex } from '../libs/bibtex/bibtex';
import { tryFetchItemByUuidViaRest, tryResolveHandleToItemMetaViaRest } from '../libs/dspace/rest';
import { fetchMetaViaHtmlModeFull } from '../libs/dspace/html';

export const server = {
  search: defineAction({
    accept: "form",
    input: z.object({
      url: z.url(),
    }),
    handler: async ({ url: rawUrl }) => {

      if (!rawUrl) throw new ActionError({ code: 'BAD_REQUEST', message: 'URL is empty.' });

      let u: URL;
      try {
        u = normalizeInputUrl(rawUrl);
      } catch (e: any) {
        console.error(rawUrl, e);
        throw new ActionError({ code: 'BAD_REQUEST', message: e?.message || 'Invalid URL.' });
      }

      try {
        // 1) If it's already an API item URL (DSpace 7)
        if (isApiItemUrl(u)) {
          const { text } = await fetchWithLimits(u, 'json');
          const meta = extractDublinCoreFromItemJson(JSON.parse(text));
          if (!Object.keys(meta).some(k => k.startsWith('dc.'))) {
            throw new ActionError({ code: 'BAD_REQUEST', message: 'The API responded but no metadata was found in the item.' });
          }
          return { ok: true, bibtex: toBibtex(meta), meta, source: 'dspace-rest' };
        }

        // 2) If it's /items/<uuid> (DSpace 7 UI) => use REST item
        const uuid = extractUuidFromPath(u.pathname);
        if (uuid) {
          const meta = await tryFetchItemByUuidViaRest(u, uuid);
          if (!meta) {
            throw new ActionError({ code: 'BAD_REQUEST', message: 'Detected /items/<uuid> but could not retrieve the item via REST (/server/api or /api).' });
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

        throw new ActionError({ code: 'BAD_REQUEST', message: 'URL not yet supported. Use a /handle/<id>/<id> link (DSpace 6/7), /items/<uuid> (DSpace 7), or a /server/api/core/items/<uuid> endpoint.' });
      } catch (e: any) {
        console.error(rawUrl, e);
        const msg = e?.name === 'AbortError'
          ? 'Request timed out while querying the repository.'
          : (e?.message || 'Error processing the URL.');
        throw new ActionError({ code: 'BAD_REQUEST', message: msg });
      }
    }
  })
}
