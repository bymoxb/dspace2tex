# DSpace to BibTeX - DSpace2BibTeX

Generate **BibTeX citations for LaTeX** directly from **DSpace repositories**.  
Paste a DSpace item URL (handle, item UI, or REST endpoint) and instantly get a ready-to-use `.bib` entry.

Supports **DSpace 6 (JSPUI)** and **DSpace 7+ (REST API)**, designed for academic repositories such as theses, articles, and technical reports.

🚀 **Try the live application:** https://dspace2tex.illapa.dev/

## Features

- Supports DSpace 6 repositories and DSpace 7 or later.
- Accepts item, handle, and REST API URLs.
- Extracts Dublin Core metadata from the DSpace REST API or, when available, the DSpace `?mode=full` page.
- Infers a BibTeX entry type: `thesis`, `article`, `techreport`, or `misc`.
- Displays the generated BibTeX citation and extracted metadata as JSON.
- Fetches repository records server-side with protections for private hosts, redirects, request time, and response size.

## Supported URLs

The application detects the URL format and selects the appropriate retrieval method.

| Repository | URL format | Retrieval method |
| --- | --- | --- |
| DSpace 6 | `/handle/<prefix>/<suffix>` | Reads Dublin Core metadata from the `?mode=full` page. |
| DSpace 7+ | `/handle/<prefix>/<suffix>` | Resolves the handle through the REST API. |
| DSpace 7+ | `/items/<uuid>` | Looks up the item through the REST API. |
| DSpace 7+ | `/server/api/core/items/<uuid>` or `/api/core/items/<uuid>` | Reads the item directly from the REST API. |

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
@thesis{anonymous2021optimization,
    author = {{Anonymous}},
    title = {Optimization Models in Networks},
    year = {2021},
    school = {Example University},
    url = {https://example.com/repository/optimization-models-2021}
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

- Astro
- cheerio
- he

## Limitations

- Only Dublin Core metadata is supported
- BibTeX output only
- Single-item processing

## Run locally

Requires Node.js `>=22.23.4` and pnpm.

```sh
pnpm install
pnpm dev
```

Create a production build with `pnpm build` and run it locally with `pnpm preview`.

## License

[MIT](./LICENSE)
