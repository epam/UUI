### Release UUI packages workflow

#### Stable release
1. Merge all changes for the release to the `main` branch
2. Update `changelog.md` with mention of all released changes
3. Ensure that all packages are building without errors — run `yarn build`
4. Start the release - run `yarn release` and follow the steps in the console
    - Make sure that the terminal is logged into the UUI GitHub account and the npm account with write access to the UUI packages.       
5. After a successful release, publish the changelog to the GitHub Releases page (`https://github.com/epam/UUI/releases`) and in the UUI Teams channel (`https://teams.microsoft.com/l/channel/19%3Af9ce97808e1e419cb976f71d310ca74f%40thread.skype/General?groupId=726eb5c9-1516-4c6a-be33-0838d9a33b02&tenantId=b41b72d0-4e9f-4c26-8a69-f949f367c91d`).

Note: If the release fails and packages aren't published, revert all commits and tags created by Lerna locally and remotely, then try again.

#### Beta release
Use `yarn release-beta` instead of `yarn release`. This will create a release with the `beta` (not `latest`) dist-tag.

#### Tips
1. Revert failed release: if your release was failed during the release process (build error, authorization error, other). 
   - Often in such cases, packages will not be published to the NPM, but lerna may already commit version update and new git tags, so you need to revert this:
   - revert the latest commit with package version update (it'd usually have new version number into commit message)
   - revert new version tags(run both)
     - local: git tag -d <tag_name(v5.7.0)>
     - remote: git push --delete origin <tag_name(v5.7.0)>
2. For NPM login, run `npm login` command in terminal and follow the steps (https://docs.npmjs.com/cli/v9/commands/npm-login)
