# UUI Build package

This package is a part of [EPAM UUI](https://github.com/epam/UUI) library.

`@epam/uui-build` consist scripts and tools to build UUI mono-repo. It contains scripts to run the repo as a single huge app (for development needs), and build each package separately for NPM.
Also, its contains some external scripts which can be used we UUI ecosystem.

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
npx @epam/uui-build@latest --theme-tokens --src-collection=./input/Theme.json --out-collection=./input/ThemeOutput.json --out-tokens=./input/ThemeTokens.json --out-mixins=./input
```
