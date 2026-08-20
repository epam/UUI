### Release workflow — one-time setup

This setup is required once before the first release using the GitHub Actions workflow.

#### 1. Configure npm Trusted Publishers

For each of the 13 published packages, add a Trusted Publisher on npmjs.org:

- Open the package page → Publishing → Trusted Publishers → **Add a publisher**
- Fill in:
  - Provider: `GitHub Actions`
  - Owner: `epam`
  - Repository: `UUI`
  - Workflow: `release.yml`
  - Environment: `npm-publish`
  - Allowed actions: **Allow npm stage publish**

  CI will run the full publish cycle (OIDC auth, build, lerna publish from-git), but packages will land in a staged state and won't be visible to consumers until a maintainer promotes them on npmjs.com. This provides an extra review gate after the automated publish.

Packages to configure (15 total):

`@epam/uui`, `@epam/uui-core`, `@epam/uui-components`, `@epam/loveship`, `@epam/promo`, `@epam/electric`, `@epam/assets`, `@epam/uui-editor`, `@epam/uui-timeline`, `@epam/uui-docs`, `@epam/uui-db`, `@epam/uui-test-utils`, `@epam/uui-build`, `@epam/uui-extra`, `@epam/cra-template-uui`

**Deprecated packages** — these names exist on npmjs.com but are no longer published from this repository and should be ignored: `@epam/edu-core-routing`, `@epam/internal`, `@epam/draft-rte`.

#### 2. Create a GitHub Environment

In repository **Settings → Environments → New environment**:

- Name: `npm-publish`
- Add **Required reviewers**: the maintainers who approve releases
- Save the environment

This creates an approval gate — every publish will pause and wait for a maintainer to approve before packages are sent to npm.

#### 3. Verify with a dry run

Before the first real release, confirm the setup works:

1. Go to **Actions → Release → Run workflow**
2. Set **tag** to an existing tag (e.g. `v6.5.2`)
3. Leave **dry_run** as `true` (default)
4. Click **Run workflow** and approve the `npm-publish` deployment

Lerna will output what would be published without actually pushing to npm. If the workflow completes successfully, the setup is correct.

#### 4. Enable automatic trigger (optional)

Once a dry run passes, you can enable automatic publishing on every tag push.
Uncomment the `push.tags` block at the top of `.github/workflows/release.yml`:

```yaml
on:
  push:
    tags:
      - 'v[0-9]+.[0-9]+.[0-9]+'
      - 'v[0-9]+.[0-9]+.[0-9]+-beta.[0-9]+'
  workflow_dispatch:
    ...
```

With this enabled, pushing a tag via `yarn release` will automatically trigger the publish workflow — no need to run it manually from the Actions tab.
