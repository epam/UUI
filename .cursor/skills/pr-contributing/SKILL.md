---
name: uui-pr-contributing
description: Guides the UUI pull request process including branch naming, pre-PR checklist, changelog updates, and quality requirements. Use when preparing a pull request, writing commit messages, or following UUI PR requirements.
---

# UUI Pull Request Process

Follow this checklist when preparing a pull request for UUI.

## Pre-PR Checklist

Before opening a PR, ensure all items are complete:

- [ ] **All tests pass** - Run `yarn test`
- [ ] **Snapshots updated** - If UI changed, run `yarn test-update`
- [ ] **E2E tests pass** - If UI changed, run `yarn test-e2e`
- [ ] **ESLint passes** - Run `yarn eslint` (or `yarn eslint-fix`)
- [ ] **Stylelint passes** - Run `yarn stylelint` (or `yarn stylelint-fix`)

**Note:** Husky runs `lint-staged` on commit, which auto-fixes ESLint and Stylelint for staged files. You can still run lint manually to catch issues before committing.
- [ ] **Bundle size check passes** - Run `yarn track-bundle-size`
- [ ] **TypeScript type checking passes** - Run `yarn test-typecheck`
- [ ] **Documentation updated** - If API changed, add examples and update Property Explorer
- [ ] **Changelog updated** - Add entry to `changelog.md`

## Git Workflow

### Branch Creation

1. **Fork and clone** the repository
2. **Create branch from `develop`** (not `main`):
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b fix/123-description
   ```

### Branch Naming

Use descriptive branch names following these patterns:

**For bug fixes:**
- `fix/123-dropdown-position` - Include GitHub issue number
- `fix/dropdown-position` - If no issue number

**For features:**
- `feature/456-new-component` - Include GitHub issue number
- `feature/new-component` - If no issue number

**For other changes:**
- `refactor/component-structure`
- `docs/update-readme`

**Important:** When working on features or bugs from GitHub issues, **include the issue number** in the branch name (e.g., `fix/123-description`, `feature/456-new-component`).

**Avoid generic names:**
- ❌ `update`
- ❌ `fix`
- ❌ `changes`

## Commit Messages

- Use clear, descriptive commit messages
- Reference issue numbers when applicable: `fix: resolve dropdown positioning issue (#123)`
- Follow conventional commit format when possible:
  - `feat: add new component`
  - `fix: correct date formatting`
  - `docs: update README`
  - `refactor: simplify component logic`
- **Before committing:** Always show the proposed commit message to the user and wait for approval before running `git commit`. Do not commit automatically.
- **Shell compatibility:** Do not use bash-only syntax (heredoc `<<'EOF'`, `&&` chaining). Use multiple `-m` flags for multi-line commits:
  ```bash
  git commit -m "subject line" -m "body line 1" -m "body line 2"
  ```

## PR Requirements

### Code Quality

- **All tests must pass** (`yarn test`)
- **Bundle size check must pass** (`yarn track-bundle-size`)
- **E2E tests must pass** (if UI changes)
- **Code must be linted** (`yarn eslint`, `yarn stylelint`)

### Documentation

If making API changes or adding functionality:

1. **Add example** to documentation:
   - Location: `app/src/docs/_examples`
   - Add link in page config: `app/src/docs/pages`

2. **Update Property Explorer**:
   - Location: `app/src/docs/explorerConfigs`
   - Add/update explorer config for component

3. **Generate API** (usually done in deployment):
   ```bash
   yarn generate-components-api
   ```

### Changelog

Add entry to the top (unreleased) section of `changelog.md`:

```markdown
# 6.x.x - xx.xx.2026

**What's New**
* [ComponentName]: description of new feature ([#456](https://github.com/epam/UUI/issues/456))

**What's Fixed**
* [ComponentName]: description of fix ([#123](https://github.com/epam/UUI/issues/123))
```

**Format:**
- Use `**What's New**` for features/enhancements, `**What's Fixed**` for bug fixes
- Prefix with `[ComponentName]:` to identify the affected component
- Include issue link in markdown format: `([#123](https://github.com/epam/UUI/issues/123))`
- Add to the existing top section; do not create a new version header

## PR Process Steps

1. **Fork and clone** the repository
2. **Create branch from `develop`** (include GitHub issue number if applicable)
3. **Make changes** following development guides
4. **Add tests** (unit and E2E where appropriate)
5. **Ensure test suite passes** (`yarn test`), update snapshots if needed
6. **Run E2E/screenshot tests** if making UI changes
7. **If making API changes:**
   - Add example to documentation
   - Update Property Explorer
8. **Add short description** to `changelog.md`
9. **Commit and push** to your fork
10. **Open PR** targeting `develop` branch

## PR Description Template

When opening a PR, include:

- **Summary** - Brief description of changes
- **Issue** - Link to GitHub issue (if applicable)
- **Type** - Bug fix, Feature, Refactor, Docs, etc.
- **Testing** - How to test the changes
- **Checklist** - Confirm all PR requirements met

## Quality Gates

PRs must pass these quality checks:

1. ✅ All tests pass
2. ✅ Bundle size check passes
3. ✅ E2E tests pass (if UI changes)
4. ✅ Code is linted
5. ✅ Documentation updated (if API changes)
6. ✅ Changelog updated

## Common Issues

### Bundle Size Check Fails

If bundle size increased intentionally:

```bash
yarn track-bundle-size-override
```

**Warning:** Only use if sizes are expected to increase. This overrides the baseline.

### Tests Fail on Windows

Use reduced worker count:

```bash
yarn test --maxWorkers=2 --testTimeout=10000
```
You can increase `maxWorkers` up to 4 if needed.

### E2E Tests Fail

1. Ensure server is running (`yarn start` or `yarn build-server && yarn start-server`)
2. Check `.env` file for `UUI_APP_BASE_URL` if using non-standard URL
3. Update screenshots if intentional: `yarn test-e2e-update`

### App Won't Start

1. Run `yarn` and `cd server && yarn` to install all dependencies
2. Run `yarn build-server` before `yarn start`
3. Ensure port 9009 is free. If occupied, set `PORT` env var or stop the conflicting process

### Run Single Test File

```bash
yarn test -- --testPathPattern="Button"
```
Use `--testNamePattern="should render"` to match test names. See [unit-testing](../unit-testing/SKILL.md) for more.

## References

- Main guidelines: [AGENTS.md](../AGENTS.md) Section 7
- Contributing guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)
- E2E testing: [.cursor/skills/e2e-testing/SKILL.md](../e2e-testing/SKILL.md)
- Unit testing: [.cursor/skills/unit-testing/SKILL.md](../unit-testing/SKILL.md)
