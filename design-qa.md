**Source visual truth**

- `/var/folders/cx/wwlc2r057m18t68yq_t948bh0000gn/T/codex-clipboard-f9510650-5c8f-4429-a67b-965d1b6bb525.png`
- `/var/folders/cx/wwlc2r057m18t68yq_t948bh0000gn/T/codex-clipboard-184fcbef-f267-4198-9e08-5c7849a8be98.png`
- `/var/folders/cx/wwlc2r057m18t68yq_t948bh0000gn/T/codex-clipboard-8ca14ffe-4d0d-44e7-9eff-b82f657ea8a4.png`

**Implementation evidence**

- Search landing: `/tmp/zleap-source-search-initial.png`
- Submitted search and open scope menu: `/tmp/zleap-source-search-result.png`
- Event detail: `/tmp/zleap-source-search-detail.png`
- Side-by-side comparison: `/tmp/zleap-source-search-comparison.jpg`
- Viewport: 1430 × 720 override; the in-app browser capture is displayed at its browser surface scale.
- State: information source search tab; public scope; submitted query; detail modal.

**Full-view comparison evidence**

- The implementation preserves the reference hierarchy: centered title, large orange-outlined query surface, inline scope selector and circular submit action, date-grouped timeline, time rail, event cards, related-item affordance, and centered event-detail modal.
- The application header, secondary navigation, and persistent product dock remain visible because this is an integrated module rather than a standalone screenshot recreation.

**Focused region comparison evidence**

- Search control: border color, 16px radius, field proportions, muted placeholder, scope menu placement, and amber action match the reference closely.
- Timeline cards: title/body/source/related-count hierarchy, warm white surface, subtle border/shadow, left time rail, and vertical rhythm match the existing information-source matter view.
- Detail modal: overlay strength, width, header divider, tag row, summary surface, source reference row, centered article title, and scrollable content match the supplied detail state.

**Findings**

- No actionable P0/P1/P2 visual or interaction mismatch remains.
- Fonts and typography: the existing product font stack, weights, line heights, and truncation are consistent with the supplied screens and current information-source UI.
- Spacing and layout rhythm: central content width, search-to-timeline spacing, card padding, rail alignment, radii, and modal spacing are consistent at the tested desktop viewport.
- Colors and visual tokens: neutral surfaces, amber/orange accents, muted metadata, borders, overlay, and shadows align with the reference and existing product tokens.
- Image quality and asset fidelity: the reference contains no raster imagery requiring generation; UI icons use the installed Remix Icon set or existing product icons.
- Copy and content: the search prompt, scope options, event-card structure, reference labels, and detail content follow the supplied examples.

**Primary interactions tested**

- Open information source module and select the first secondary menu item.
- Open and close the search-scope menu.
- Submit a query with Enter and verify the matching matter list.
- Open an event detail modal and verify the detail content.
- Browser console errors checked: none.

**Comparison history**

- Initial comparison: no P0/P1/P2 findings. No visual fix iteration was required after the first browser-rendered comparison.

**Follow-up polish**

- P3: the persistent product dock partially overlaps lower timeline content at short browser heights; this is existing global-shell behavior and is outside this module's requested scope.

**Implementation checklist**

- [x] Search entry is first in the information-source secondary menu.
- [x] Search landing, scope selector, query submission, matter results, related-item expansion, and event detail are interactive.
- [x] Production build passes.
- [x] Browser-rendered states and console are verified.

final result: passed
