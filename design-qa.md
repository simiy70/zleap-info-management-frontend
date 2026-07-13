**Source visual truth**

- Browser Comments for the global header/personal center and Agent detail field removal in the current task.
- Additional user reference image for the expanded personal-center menu.
- Reference viewports: 1440 × 900 and 1344 × 850 desktop browser surfaces.

**Implementation evidence**

- Expanded personal center: `docs/design-qa/header-personal-center-open.png`
- Agent detail after field removal: `docs/design-qa/agent-detail-fields-removed.png`
- States: Desktop with personal center open; Dynamic → followed Agent detail.

**Full-view comparison evidence**

- The shared header now contains language, help, notification, avatar, user name, and an expand/collapse chevron.
- The expanded personal center shows avatar, name/edit affordance, phone number, account settings, invite, app download, MCP authorization, and logout.
- Shared module labels such as “桌面”, “助手”, “任务”, and “动态” are no longer rendered beside the Beta badge.
- The Agent detail hero no longer renders the “1 条动态 / 3 天未更新” badge row; the surrounding hero, tabs, sidebar, and feed remain unchanged.

**Focused region comparison evidence**

- The header screenshot captures the trigger and the complete opaque dropdown above the fixed assistant panel.
- The Agent detail screenshot captures the hero from the top of the page and confirms the deleted field leaves clean spacing before the tabs.
- Scoped DOM checks confirm the Agent detail `<main>` contains zero exact matches for both removed labels.

**Findings**

- No actionable P0/P1/P2 visual or interaction mismatch remains.
- Typography: existing font family, hierarchy, truncation, and weights are preserved.
- Spacing: the removed module label and Agent badge row collapse through the existing flex layout without manual offsets.
- Layering: the global header is raised above the fixed desktop assistant so the personal-center menu is never obscured.
- Colors: the dropdown uses an opaque white surface and the existing shadow, border, icon, and muted-text tokens.
- Image quality: existing avatar fallbacks and feed imagery are preserved; no new raster asset was required.

**Primary interactions tested**

- Open the personal center from the shared header and verify all requested menu items are visible.
- Close the menu and navigate from Desktop to Dynamic.
- Verify the Dynamic shared header also omits its module label.
- Open “硅谷早报 Agent” from My Following and verify the two annotated fields are absent from the detail hero.
- Console checked after final states: no page errors were produced.

**Comparison history**

- Earlier state: header displayed a page-specific module label and a compact user/plan block; Agent detail displayed dynamic-count and stale-update badges.
- Fixes: moved identity actions into a click-to-expand personal center, removed title rendering from the shared header, and removed the Agent detail badge row.
- Post-fix evidence: both screenshots and scoped DOM checks above show the requested states.

**Implementation checklist**

- [x] Personal center trigger and dropdown implemented.
- [x] Dropdown remains above the fixed assistant panel.
- [x] Shared module names removed across Desktop, Assistant, Task, and Dynamic pages.
- [x] Agent detail dynamic-count and stale-update row removed.
- [x] Production build passes.
- [x] Browser-rendered states and console verified.

final result: passed
