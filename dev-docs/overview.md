## UUI Overview
The UUI codebase uses a monorepo managed with Yarn Workspaces and Lerna.
For local development, we use an approach where the entire repository is built by Create React App (CRA), which then rebuilds on any code change.
However, for building modules for release and for production environments, each workspace is built using a separate build process.

### Project Structure

```
├── app    # uui.epam.com documentation site codebase
├── epam-assets    # @epam/assets package. Contains icon set, fonts, SCSS global variables, and common mixins
├── epam-promo    # @epam/promo package. Skin for Promo theme.
├── loveship    # @epam/loveship package. Skin for Loveship theme.
├── epam-electric    # @epam/electric package. Skin for Electric theme.
├── public    # static files for uui.epam.com site (example contents, images, doc gen artifacts). Usually this folder is used by the UUI server.
├── server    # Node.js server for uui.epam.com site. Serves docs content, demo API, UUI MCP.
├── templates    # templates of uui project for CRA, Next.js and Vite
├── test-utils    # @epam/uui-test-utils package. Common utils for writing tests with UUI components.
├── uui    # @epam/uui package. Ready-to-use, themeable UUI components for default and custom themes.
├── uui-build    # epam/uui-build package. Utils and scripts to build UUI repo and packages, linting configuration and some npm scripts.
├── uui-components    # @epam/uui-components package. Logic-only components without visual styles. Styles are added in the 'uui' package.
├── uui-core    # @epam/uui-core package. Core interfaces and types, services, data sources, hooks, helpers, and utilities.
├── uui-db    # @epam/uui-db package — client-side relational state cache.
├── uui-docs    # @epam/uui-docs package. Utilities, components, and demo data for the documentation site. Internal package, not used by UUI consumers.
├── uui-editor    # @epam/uui-editor package. Rich Text Editor based on SlateJS.
├── uui-timeline    # @epam/uui-timeline package. Components to build interactive timelines.
├── next-demo    # demo app to test next.js integration
└── extra    # @epam/extra package. Experimental packages; currently outdated and abandoned.
```

### Environments

`main` branch - https://uui.epam.com/
`develop` branch - https://uui-dev.epm-ppa.projects.epam.com/
`feature/icons-for-theming` branch(could be changed in `.github/workflows/qa.yml`) - https://uui-qa.epm-ppa.projects.epam.com/

