import { assertSafePublicHost } from "../security/ssrf";

// -------------------- Config seguridad --------------------
const MAX_BYTES = 2_000_000; // 2 MB (HTML o JSON)
const FETCH_TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 4;

// -------------------- Fetch seguro genérico (HTML/JSON) --------------------
export async function fetchWithLimits(startUrl: URL, expect: 'html' | 'json'): Promise<{ finalUrl: URL; text: string }> {
    let current = startUrl;
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
        for (let i = 0; i <= MAX_REDIRECTS; i++) {
            await assertSafePublicHost(current.hostname);

            const res = await fetch(current.toString(), {
                cache: 'no-store',
                redirect: 'manual',
                signal: controller.signal,
                headers: {
                    Accept: expect === 'json'
                        ? 'application/json'
                        : 'text/html,application/xhtml+xml',
                    'User-Agent': 'Mozilla/5.0 (Next.js Server Action)',
                },
            });

            if (res.status >= 300 && res.status < 400) {
                const loc = res.headers.get('location');
                if (!loc) throw new Error('Redirección sin Location.');
                current = new URL(loc, current);
                continue;
            }

            if (!res.ok) throw new Error(`No se pudo obtener el recurso (${res.status}).`);

            const ct = (res.headers.get('content-type') || '').toLowerCase();
            if (expect === 'json' && !ct.includes('application/json')) {
                throw new Error('La respuesta no es JSON (content-type inesperado).');
            }

            if (expect === 'html' && !ct.includes('text/html') && !ct.includes('application/xhtml')) {
                throw new Error('La respuesta no es HTML (content-type inesperado).');
            }

            const cl = res.headers.get('content-length');
            if (cl) {
                const n = Number(cl);
                if (!Number.isNaN(n) && n > MAX_BYTES) throw new Error('El documento es demasiado grande para procesarlo.');
            }

            if (!res.body) throw new Error('Respuesta vacía.');

            const reader = res.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let total = 0;
            let out = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                if (value) {
                    total += value.byteLength;
                    if (total > MAX_BYTES) throw new Error('El documento supera el tamaño máximo permitido.');
                    out += decoder.decode(value, { stream: true });
                }
            }
            out += decoder.decode();

            return { finalUrl: current, text: out };
        }

        throw new Error('Demasiadas redirecciones.');
    } finally {
        clearTimeout(t);
    }
}
