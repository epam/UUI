# UUI Build package

This package is a part of [EPAM UUI](https://github.com/epam/UUI) library.

`@epam/uui-build` consists of scripts and tools to build UUI monorepo. It contains scripts to run the repo as a single huge app (for development needs), and to build each package separately for NPM.
Also, it contains some external scripts that can be used within UUI ecosystem.

### CLI scripts
1. Build a project using Rollup
```shell
# Build
npx @epam/uui-build@latest --rollup-build
# Build & Watch
npx @epam/uui-build@latest --rollup-build --watch
```

2. Generate a set of SCSS mixins with theme tokens. A collection of variables exported from Figma (*.json) is used as input.
```shell
npx @epam/uui-build@latest --generate-theme-variables --tokens=./input/Theme.json --out=./input
```
