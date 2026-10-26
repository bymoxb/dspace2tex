import { decode as heDecode } from 'he';

// -------------------- Utilidades texto --------------------
export function cleanText(input: string) {
    const decoded = heDecode(input);
    return decoded.replace(/\s+/g, ' ').trim();
}

export function bibEscape(s: string) {
    return s
        .replaceAll('\\', '\\\\')
        .replaceAll('{', '\\{')
        .replaceAll('}', '\\}')
        .replaceAll('\n', ' ')
        .trim();
}