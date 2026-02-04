# DSpace to BibTeX

Generate **BibTeX citations for LaTeX** directly from **DSpace repositories**.  
Paste a DSpace item URL (handle, item UI, or REST endpoint) and instantly get a ready-to-use `.bib` entry.

Supports **DSpace 6 (JSPUI)** and **DSpace 7+ (REST API)**, designed for academic repositories such as theses, articles, and technical reports.

## Features

- Generate BibTeX from DSpace repository URLs
- Supports DSpace 6 (`/handle/...` with `?mode=full`)
- Supports DSpace 7+ (`/items/<uuid>` and REST API)
- Automatic Dublin Core metadata extraction
- Smart BibTeX entry type detection (`thesis`, `article`, `techreport`, `misc`)
- Safe server-side fetching (SSRF protection, size & timeout limits)
- Built with Next.js Server Actions

## Supported URL types

The tool automatically detects the correct strategy based on the URL.

### DSpace 7 (REST API)

- `/server/api/core/items/<uuid>`
- `/api/core/items/<uuid>`
- `/items/<uuid>` (resolved via REST)

### DSpace 6 / 7 (Handle UI)

- `/handle/<authority>/<id>`  
  Tries REST first, falls back to `?mode=full` HTML parsing

## Examples

https://repositorio.usfq.edu.ec/handle/23000/14349  
https://repositorio.uta.edu.ec/items/232db8b3-ad43-41ca-b4c8-8166eb70241c  
https://repositorio.uta.edu.ec/server/api/core/items/232db8b3-ad43-41ca-b4c8-8166eb70241c

## BibTeX output

The generated BibTeX entry is inferred from Dublin Core metadata.

### Metadata mapping

- Authors: `dc.contributor.author`, `dc.creator`
- Title: `dc.title`
- Year: extracted from `dc.date.*`
- URL: `dc.identifier.uri`
- Institution / Publisher:
  - `school` for theses
  - `institution` for technical reports
  - `note` for articles when journal is not applicable

### Example

```bibtex
@thesis{Perez2021modelos,
  author = {Pérez, Juan},
  title = {Modelos de optimización en redes},
  year = {2021},
  school = {Universidad Técnica de Ambato},
  url = {https://repositorio.uta.edu.ec/handle/123456789/9999}
}
```

## Security considerations

All remote requests are executed server-side with strict safety controls:

- SSRF protection (blocks localhost and private IPs)
- Redirect limit
- Request timeout
- Maximum response size
- Content-Type validation (HTML or JSON only)

## Tech stack

- Next.js (App Router)
- React
- TypeScript
- cheerio
- he

## Limitations

- Only Dublin Core metadata is supported
- BibTeX output only
- Single-item processing

## License

MIT
