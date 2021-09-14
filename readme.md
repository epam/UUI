# UUI
<img align="right" width="160" height="160"
     alt="UUI project logo"
     src="https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/Images/uui-logo-readme.svg">

React-based components and accelerators library built by EPAM Systems.

## Features

- :black_joker: Rich set of components: from buttons to data tables
- :rocket: Common services: modals, notifications, error, monitoring, and more
- :wrench: State-management primitives: Forms with validation, Lists and Tables with lazy-loading
- :octocat: Open for contribution, actively evolving, supported, and used by 25+ EPAM internal production projects
- :lipstick: Allows deep customization to build your own brand UI components set on top
- :memo: Not opinionated, you don't have to all-in: it's compatible with CRA, Babel/TypeScript, LESS/SASS, Apollo/Redux.

## Documentation

Check out [UUI website](https://uui.epam.com) for [demo](https://uui.epam.com/demo) and [documentation](https://uui.epam.com/documents?id=overview&mode=doc&skin=UUI4_promo).

To add UUI to an existing project, read more [here](https://uui.epam.com/documents?id=gettingStarted).

## Quick start:

Try our pre-configured template on
    <a href="https://codesandbox.io/s/uui-w4i61" target="_blank">
        Codesandbox
        <img
            width="24"
            height="24"
            alt="Codesandbox"
            align="center"
            src="https://camo.githubusercontent.com/ccf186cd931b6a61cf49bd0a3aeacb2d73be7e91210453571bdcf9f5b1057173/687474703a2f2f63646e2e656d6265642e6c792f70726f7669646572732f6c6f676f732f636f646573616e64626f782e706e67"
        />
    </a>

## Getting started

We recommend to use our custom [UUI template](https://www.npmjs.com/package/@epam/cra-template-uui) for [Create React App](https://reactjs.org/docs/create-a-new-react-app.html) to create React application with already configured environment.

```sh
npx create-react-app my-app --template @epam/uui

# or

yarn create react-app my-app --template @epam/uui
```

## Packages

| Project | Status | Description |
|---------|--------|-------------|
| [@epam/uui-build](https://github.com/epam/UUI/tree/main/uui-build)          | [![npm version](https://badge.fury.io/js/@epam%2Fuui-build.svg)](https://www.npmjs.com/package/@epam%2Fuui-build) | Used internally to build UUI mono-repo |
| [@epam/uui-components](https://github.com/epam/UUI/tree/main/uui-components)          | [![npm version](https://badge.fury.io/js/@epam%2Fuui-components.svg)](https://www.npmjs.com/package/@epam%2Fuui-components) | Set of healess core components |
| [@epam/uui-db](https://github.com/epam/UUI/tree/main/uui-db)          | [![npm version](https://badge.fury.io/js/@epam%2Fuui-db.svg)](https://www.npmjs.com/package/@epam%2Fuui-db) | State-manager, allow to manage UI operations asynchronously. |
| [@epam/uui-docs](https://github.com/epam/UUI/tree/main/uui-docs)          | [![npm version](https://badge.fury.io/js/@epam%2Fuui-docs.svg)](https://www.npmjs.com/package/@epam%2Fuui-docs) | [Slate.js](https://www.slatejs.org/)-based Rich Text Editor |
| [@epam/uui-editor](https://github.com/epam/UUI/tree/main/uui-editor)          | [![npm version](https://badge.fury.io/js/@epam%2Fuui-editor.svg)](https://www.npmjs.com/package/@epam%2Fuui-editor) | Set of helpers to document UUI libraries. |
| [@epam/uui-timeline](https://github.com/epam/UUI/tree/main/uui-timeline)          | [![npm version](https://badge.fury.io/js/@epam%2Fuui-timeline.svg)](https://www.npmjs.com/package/@epam%2Fuui-timeline) | UUI Timeline provides facilities to build a Ghant-chart like interfaces. |
| [@epam/uui](https://github.com/epam/UUI/tree/main/uui)          | [![npm version](https://badge.fury.io/js/@epam%2Fuui.svg)](https://www.npmjs.com/package/@epam%2Fuui) | Contains a core parts of the UUI library |


## Development

To start locally.

1. Clone github repository:

```
git clone git@github.com:epam/UUI.git
```

2. Before starting the App you need to start the server. To do this you must go to the `server` folder and run yarn:

```
cd ./server
yarn
```
3. Go back to the `UUI` folder and run the App:

```
cd ../
yarn
yarn start
```

This would open the uui.epam.com web-site locally, in watch mode.


## License

[MIT](./LICENCE.MD)
