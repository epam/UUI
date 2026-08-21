---
name: uui-release-workflow
description: Guides the UUI package release process including stable and beta releases, changelog updates, and handling failed releases. Use when releasing UUI packages, updating changelog, or troubleshooting release issues. For maintainers only.
---

# UUI Release Workflow

## Important

**Always ask for explicit user permission before triggering a release.** Publishing packages to npm cannot be undone. Never initiate the publish workflow without confirming the user intends to do so.

**Before asking for permission, provide a pre-publish summary:**
- **Version**: The version that will be published (from `changelog.md` top section or Lerna)
- **Packages**: Which packages will be published (from `package.json` workspaces)
- **Summary**: Brief highlights of changes from the current `changelog.md` entry

## How publishing works

Publishing is done via GitHub Actions using npm Trusted Publishers (OIDC). No npm token or OTP is required.

The release process has two parts:
1. **Version bump (local)** — `yarn release` runs `lerna version --force-publish` interactively. Lerna creates a version commit, tag, and pushes both to the release branch.
2. **Publish (GitHub Actions)** — the maintainer manually triggers the `Release` workflow in GitHub, selects the tag and dist-tag, approves the `npm-publish` environment gate, and CI publishes all 13 packages.

## Prerequisites

- Release branch created from `develop` (e.g. `release/vX.Y.Z`)
- `changelog.md` updated with all released changes
- Builds verified: `yarn build`

## Stable Release

1. On the release branch, run: `yarn release`
2. Lerna prompts for version type — choose patch / minor / major
3. Lerna commits the version bump, creates tag `vX.Y.Z`, pushes to the release branch
4. Go to GitHub → Actions → Release → **Run workflow**
   - `tag`: the tag from step 3 (e.g. `v6.5.3`)
   - `dist_tag`: `latest`
   - `dry_run`: `false`
5. Approve the deployment in the `npm-publish` environment
6. After successful publish: post changelog to GitHub Releases and UUI Teams channel
7. Open PR from release branch into `main`
8. **Sync `main` back into `develop`** (see dev-docs/release-workflow.md for steps)

## Beta Release

Same steps, with:
- In step 2, enter a prerelease version when prompted (e.g. `6.5.3-beta.0`)
- In step 4, set `dist_tag` to `beta`

## Dry Run (testing)

Trigger the workflow with `dry_run: true` (default) and an existing tag to validate the build and publish steps without actually uploading to npm.

## Handling Failed Releases

If the release fails after Lerna already created the version commit and tag:

1. Revert the version bump commit
2. Delete local tag: `git tag -d <tag_name>`
3. Delete remote tag: `git push --delete origin <tag_name>`
4. Fix the issue and run `yarn release` again

## Release Checklist

- [ ] Release branch created from `develop`
- [ ] All changes merged into the release branch
- [ ] Changelog updated
- [ ] Builds verified (`yarn build`)
- [ ] **User permission obtained** to publish to npm
- [ ] `yarn release` — version bump + tag pushed
- [ ] GitHub Actions workflow triggered with correct tag and dist-tag
- [ ] `npm-publish` environment approved
- [ ] Workflow completed successfully
- [ ] Changelog published to GitHub Releases
- [ ] Team notified in Teams channel
- [ ] PR from release branch into `main` opened
- [ ] `main` synced back into `develop`
- [ ] `git log origin/develop..origin/main` is empty
