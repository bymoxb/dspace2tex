import { bibEscape } from "../text";

// -------------------- BibTeX (simple, extensible) --------------------

export function firstNonEmpty(meta: Record<string, string[]>, keys: string[]) {
    for (const k of keys) {
        const v = meta[k]?.find(Boolean);
        if (v) return v;
    }
    return '';
}

export function allValues(meta: Record<string, string[]>, keys: string[]) {
    const out: string[] = [];
    for (const k of keys) out.push(...(meta[k] ?? []));
    return out.map(v => v.trim()).filter(Boolean);
}

export function pickYear(meta: Record<string, string[]>) {
    const raw =
        firstNonEmpty(meta, ['dc.date.issued', 'dc.date.available', 'dc.date.accessioned', 'dc.date']) || '';
    const match = raw.match(/\b(19|20)\d{2}\b/);
    return match ? match[0] : '';
}

export function makeKey(author: string, year: string, title: string) {
    const surname =
        author.split(',')[0]?.split(' ').filter(Boolean).slice(-1)[0] ||
        author.split(' ').filter(Boolean).slice(-1)[0] ||
        'ref';

    const shortTitle = title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 3)
        .join('');

    const base = `${surname}${year}${shortTitle || ''}`.replace(/[^a-zA-Z0-9]/g, '');
    return base || `ref${year || ''}`;
}

export function inferEntryType(meta: Record<string, string[]>) {
    const t = (firstNonEmpty(meta, ['dc.type']) || '').toLowerCase();
    if (t.includes('tesis') || t.includes('thesis') || t.includes('dissertation')) return 'thesis';
    if (t.includes('report') || t.includes('informe') || t.includes('technical')) return 'techreport';
    if (t.includes('article') || t.includes('artículo') || t.includes('articulo')) return 'article';
    return 'misc';
}

export function toBibtex(meta: Record<string, string[]>) {
    const authors = allValues(meta, ['dc.contributor.author', 'dc.creator', 'dc.contributor']).join(' and ');
    const title = firstNonEmpty(meta, ['dc.title']) || '';
    const year = pickYear(meta);
    const url = firstNonEmpty(meta, ['dc.identifier.uri', 'dc.identifier', 'dc.relation.uri']) || '';
    const institution =
        firstNonEmpty(meta, ['dc.publisher', 'dc.contributor.institution', 'dc.contributor.affiliation']) || '';

    const entryType = inferEntryType(meta);
    const key = makeKey(authors || institution || 'ref', year, title);

    const fields: Record<string, string> = {};
    if (authors) fields.author = bibEscape(authors);
    if (title) fields.title = bibEscape(title);
    if (year) fields.year = bibEscape(year);
    if (url) fields.url = bibEscape(url);

    // No usar journal por defecto en repositorios
    if (entryType === 'article') {
        if (institution) fields.note = bibEscape(institution);
    } else if (entryType === 'thesis') {
        if (institution) fields.school = bibEscape(institution);
    } else if (entryType === 'techreport') {
        if (institution) fields.institution = bibEscape(institution);
    } else {
        if (institution) fields.institution = bibEscape(institution);
    }

    const lines = Object.entries(fields).map(([k, v]) => `  ${k} = {${v}},`);
    if (lines.length) lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, '');

    return `@${entryType}{${key},\n${lines.join('\n')}\n}\n`;
}