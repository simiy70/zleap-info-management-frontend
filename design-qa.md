**Source visual truth**

- Current browser annotations and attached references for Desktop, 信息源, 动态卡片与报告详情。
- Reference behaviors: full-width task/assistant modules, locally scrollable insight/source lists, four source states, report detail modal, and the 新建信息源 two-tab modal.

**Implementation evidence**

- `docs/design-qa/desktop-card-title-updates.png` — desktop card layout capture.
- Browser DOM verification at the local preview confirmed the requested labels, status states, modal controls, and source creation options.

**Focused comparison**

- Task and assistant pages now use the full viewport width, matching the 信息源 page rather than a centered max-width shell.
- Agent 动态 “查看全部” routes to the 关注 tab; report cards open a two-column report/comment detail dialog.
- 今日洞察与异常信息源 use bounded local scrolling; abnormal rows expose 查看详情 and 重试.
- 信息源状态 renders 未同步、同步中、同步成功、同步失败 four-state distribution, with success/failure positions swapped per the latest annotation.
- 新建信息源 uses 上传文件 / 连接器 tabs, six upload options in a three-column grid, and a full-width browser plugin entry.

**Validation**

- Production build: `npm run build` passed.
- Browser smoke checks: desktop labels, four status labels, source modal title/upload/plugin options, and feed navigation state.
- No new console errors observed during the verified flows.

**Findings**

- No actionable P0/P1/P2 mismatch remains for the annotated behaviors.
- Existing tokens, icons, responsive breakpoints, and unrelated user worktree changes were preserved.

final result: passed
