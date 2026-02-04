import { lookup } from 'node:dns/promises';
import net from 'node:net';

// -------------------- Seguridad SSRF básica --------------------
function isLocalhostHost(hostname: string) {
    const h = hostname.toLowerCase();
    return h === 'localhost' || h.endsWith('.localhost');
}

function isPrivateIPv4(ip: string) {
    const parts = ip.split('.').map(n => parseInt(n, 10));
    if (parts.length !== 4 || parts.some(n => Number.isNaN(n) || n < 0 || n > 255)) return false;
    const [a, b] = parts;

    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;

    return false;
}

function isPrivateIPv6(ip: string) {
    const s = ip.toLowerCase();
    if (s === '::1') return true;
    if (s.startsWith('fc') || s.startsWith('fd')) return true;
    if (s.startsWith('fe8') || s.startsWith('fe9') || s.startsWith('fea') || s.startsWith('feb')) return true;
    return false;
}

export async function assertSafePublicHost(hostname: string) {
    if (!hostname) throw new Error('URL inválida (sin host).');
    if (isLocalhostHost(hostname)) throw new Error('Host no permitido (localhost).');

    const ipType = net.isIP(hostname);
    if (ipType === 4) {
        if (isPrivateIPv4(hostname)) throw new Error('Host no permitido (IP privada).');
        return;
    }
    if (ipType === 6) {
        if (isPrivateIPv6(hostname)) throw new Error('Host no permitido (IP privada).');
        return;
    }

    const addrs = await lookup(hostname, { all: true, verbatim: true });
    for (const a of addrs) {
        if (a.family === 4 && isPrivateIPv4(a.address)) throw new Error('Host no permitido (resuelve a IP privada).');
        if (a.family === 6 && isPrivateIPv6(a.address)) throw new Error('Host no permitido (resuelve a IP privada).');
    }
}
