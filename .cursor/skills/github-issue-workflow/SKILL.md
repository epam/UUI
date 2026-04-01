---
name: uui-github-issue-workflow
description: Fetches GitHub issues from URLs and creates implementation plans for UUI. Use when the user provides a GitHub issue link (github.com/.../issues/N), asks to plan work from an issue, or implement/fix an issue by URL.
---

# GitHub Issue Workflow

When the user provides a GitHub issue URL or asks to plan work from an issue, follow this **two-phase workflow**. Always run Phase 1 first; only proceed to Phase 2 after the user confirms.

## Trigger

Apply this skill when the user:
- Pastes a GitHub issue URL (e.g. `https://github.com/epam/UUI/issues/123`)
- Asks to "plan", "implement", or "fix" an issue by link
- References an issue with a `github.com/.../issues/N` or `.../pull/N` URL

---

## Phase 1: Analysis (always run first)

Run Phase 1 to analyze scope before implementation. **Do not implement yet.** Limit exploration; produce a short analysis and stop.

### 1. Parse the URL

Extract from the URL:
- **owner** — e.g. `epam` from `github.com/epam/UUI/issues/123`
- **repo** — e.g. `UUI`
- **issue_number** — e.g. `123`

Supported patterns:
- `https://github.com/{owner}/{repo}/issues/{number}`
- `https://github.com/{owner}/{repo}/pull/{number}` (PRs are issues; use `issue_number` from URL)

If the URL is invalid or cannot be parsed, ask the user to provide a valid `github.com/.../issues/N` URL.

### 2. Fetch Issue Content (Dual Path)

**Always try GitHub MCP first.** Only fall back to WebFetch if MCP is unavailable.

**Step 1: Check for GitHub MCP server**

Browse the MCP tool descriptors folder to find a GitHub MCP server. Look for server folders that contain GitHub-related tools (e.g. `get_issue`, `issue_read`, `get-issue`). Common server names: `github`, `github-mcp`, `github-mcp-server`.

If a GitHub MCP server is found, read its tool descriptor to get the exact tool name and parameters, then call it:

```
CallMcpTool
  server: <discovered GitHub MCP server name>
  toolName: <issue read tool from descriptor>
  arguments: { owner, repo, issue_number }
```

- MCP returns structured JSON with title, body, labels, state, etc.
- If the call succeeds, use the response directly.

**Step 2: Fall back to WebFetch (only if MCP is not available or fails)**

If no GitHub MCP server is configured, or the MCP call fails:
- Use `WebFetch` with the full issue URL
- Parse the returned content (markdown/HTML) to extract:
  - Issue title (from page heading or title element)
  - Issue description/body
  - Labels or type indicators if visible

### 3. Produce Short Analysis (Phase 1 only)

Based on the issue content, produce a **concise** analysis:

| Section | Content |
|---------|---------|
| **Summary** | Title, type (bug/feature/refactor/docs), 2–4 key points from description |
| **Affected Areas** | Package(s), likely files or components (high-level; no deep codebase exploration yet) |
| **Complexity Estimate** | `small` / `medium` / `large` — based on description scope |
| **Proposed Approach** | 1–2 sentences on how to fix or implement |

### 4. Stop and Ask for Confirmation

**Do not create a full implementation plan or make any code changes.**

Present the analysis and ask:

> "Here's my analysis. Proceed with full implementation? Any changes to scope or approach?"

Wait for the user to confirm or request changes. Only after explicit confirmation (e.g. "yes", "proceed", "go ahead") move to Phase 2.

---

## Phase 2: Implementation (only after user confirms)

Run Phase 2 only when the user has approved the analysis or provided adjustments.

### 1. Create Full Implementation Plan

Produce a structured plan with these sections:

| Section | Content |
|---------|---------|
| **Issue Summary** | Title, type (bug/feature/refactor/docs), key points from description |
| **Branch Name** | Follow [pr-contributing](.cursor/skills/pr-contributing/SKILL.md): `fix/123-description` for bugs, `feature/456-description` for features. Use kebab-case for the description part. |
| **Affected Areas** | Package(s) (e.g. `uui`, `uui-components`), likely files, components |
| **Implementation Steps** | Ordered tasks. For component work, follow [components](.cursor/skills/components/SKILL.md) patterns (wrapping vs new, `withMods`, file paths). |
| **Testing** | Unit tests ([unit-testing](.cursor/skills/unit-testing/SKILL.md)), E2E/screenshot tests if UI changes ([e2e-testing](.cursor/skills/e2e-testing/SKILL.md)) |
| **Documentation** | If API changes: examples, Property Explorer ([documentation](.cursor/skills/documentation/SKILL.md)) |
| **Pre-PR Checklist** | From [pr-contributing](.cursor/skills/pr-contributing/SKILL.md): tests, lint, bundle size, changelog |

### 2. Output Format (Phase 2)

Use this template:

```markdown
## Implementation Plan: #[issue_number] [Title]

### Summary
- **Type:** [bug|feature|refactor|docs]
- **Key points:** [bullet points from description]

### Branch
`fix/123-description` / `feature/456-description`

### Affected Areas
- Package: ...
- Files: ...

### Steps
1. ...
2. ...

### Testing
- Unit: ...
- E2E: (if UI changes)

### Documentation
- (if API changes)

### Checklist
- [ ] yarn test
- [ ] yarn test-update (if UI)
- [ ] yarn test-e2e (if UI)
- [ ] yarn eslint, yarn stylelint
- [ ] yarn track-bundle-size
- [ ] changelog.md
```

### 3. Execute Implementation

After presenting the plan, proceed with implementation steps as approved by the user.

## Edge Cases

| Case | Action |
|------|--------|
| **Invalid URL** | Ask for a valid `github.com/.../issues/N` URL |
| **PR URL** (`/pull/N`)** | Extract issue_number from URL; MCP `issue_read` works for PRs in many setups. Otherwise use web fetch. |
| **MCP call fails** | Proceed immediately with web fetch (WebFetch tool); do not retry MCP. |

## References

- Branch naming, checklist: [pr-contributing](.cursor/skills/pr-contributing/SKILL.md)
- Component patterns: [components](.cursor/skills/components/SKILL.md)
- Doc examples, Property Explorer: [documentation](.cursor/skills/documentation/SKILL.md)
- Unit tests: [unit-testing](.cursor/skills/unit-testing/SKILL.md)
- E2E/screenshot tests: [e2e-testing](.cursor/skills/e2e-testing/SKILL.md)
