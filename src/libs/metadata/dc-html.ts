import * as cheerio from 'cheerio';
import { cleanText } from '../text';

// -------------------- DC HTML (JSPUI mode=full) --------------------
export function extractDublinCoreFromModeFull(html: string): Record<string, string[]> {
    const $ = cheerio.load(html);
    const meta: Record<string, string[]> = {};

    $('tr').each((_, tr) => {
        const tds = $(tr).find('td');
        if (tds.length < 2) return;

        const field = cleanText($(tds[0]).text());
        const value = cleanText($(tds[1]).text());

        if (!field.startsWith('dc.')) return;
        if (!value) return;

        (meta[field] ||= []).push(value);
    });

    return meta;
}