// Prefijos típicos de REST DSpace 7+
export const API_PREFIX_CANDIDATES = ['/server/api', '/api'] as const;

// -------------------- Normalización de URL de entrada --------------------
export function normalizeInputUrl(raw: string) {
    const u = new URL(raw);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('Only http/https URLs are allowed.');
    u.hash = '';
    return u;
}

export function forceModeFull(u: URL) {
    const copy = new URL(u.toString());
    copy.searchParams.set('mode', 'full');
    return copy;
}

export function extractUuidFromPath(pathname: string) {
    // UUID v4 típico: 8-4-4-4-12
    const m = pathname.match(/\/items\/([0-9a-fA-F-]{36})\/?$/);
    return m ? m[1] : '';
}

export function extractHandleFromPath(pathname: string) {
    const m = pathname.match(/\/handle\/([^/]+\/[^/?#]+)\/?$/);
    return m ? m[1] : '';
}

export function isApiItemUrl(u: URL) {
    return /\/(server\/api|api)\/core\/items\/[0-9a-fA-F-]{36}\/?$/.test(u.pathname);
}

export function isApiHandleUrl(u: URL) {
    return /\/(server\/api|api)\/core\/handles\/[^/]+\/[^/?#]+\/?$/.test(u.pathname);
}

export function buildApiUrl(base: URL, apiPrefix: string, path: string) {
    // base: https://repositorio.xxx.edu.ec/...
    const origin = base.origin;
    return new URL(`${origin}${apiPrefix}${path}`);
}