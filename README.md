# UUI
[<img align="right" width="120" height="120"
     alt="UUI project logo"
     src="https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/Images/uui-logo-readme.svg" 
      />](https://uui.epam.com/)

React-based components and accelerators library built by EPAM Systems.
<br/>
<br/>
<br/>     


## Features

- :black_joker: Rich set of components: from buttons to data tables
- :rocket: Common services: modals, notifications, error, monitoring, and more
- :wrench: State-management primitives: Forms with validation, Lists and Tables with lazy-loading
- :octocat: Open for contribution, actively evolving, supported, and used by 40+ EPAM internal production projects
- :lipstick: Allows deep customization to build your own brand UI components set on top
- :memo: Not opinionated, you don't have to go all in: it's compatible with CRA, Babel/TypeScript, LESS/SASS, Apollo/Redux.

## Documentation

Check out [UUI website](https://uui.epam.com) for [demo](https://uui.epam.com/demo) and [documentation](https://uui.epam.com/documents?id=overview&mode=doc&skin=UUI4_promo).


## Getting started
To add UUI into an existing project, check out our [Getting Started](https://uui.epam.com/documents?id=gettingStarted&theme=electric) guide.

For the new projects we recommend to use our custom [CRA](https://github.com/epam/UUI/tree/main/templates/uui-cra-template), [Vite](https://github.com/epam/UUI/tree/main/templates/uui-vite-template) or [Next.js](https://github.com/epam/UUI/tree/main/templates/uui-nextjs-template) app templates for quick start


```sh
#CRA 
npx create-react-app my-app --template @epam/uui

# Vite

npx -- degit@latest https://github.com/epam/UUI/templates/uui-vite-template my-app

# Next.js

npx create-next-app --example "https://github.com/epam/UUI/tree/main/templates/uui-nextjs-template/template" my-app
```
## Quick Try

Try our pre-configured template on
    <a href="https://codesandbox.io/s/uui-bddgvi?file=/src/Example.tsx" target="_blank">
        Codesandbox
        <img
            width="24"
            height="24"
            alt="Codesandbox"
            align="center"
            src="https://github.com/user-attachments/assets/c896f380-d27f-4ebe-a1e8-b41d61cd8f52"
        />
    </a>

## Packages

| Project                                                                      | Status                                                                                                                      | Description                                                                  |
|------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| [@epam/uui](https://github.com/epam/UUI/tree/main/uui)                       | [![npm version](https://badge.fury.io/js/@epam%2Fuui.svg)](https://www.npmjs.com/package/@epam%2Fuui)                       | A set of themable components                                                 |
| [@epam/uui-components](https://github.com/epam/UUI/tree/main/uui-components) | [![npm version](https://badge.fury.io/js/@epam%2Fuui-components.svg)](https://www.npmjs.com/package/@epam%2Fuui-components) | A set of headless core components                                            |
| [@epam/uui-core](https://github.com/epam/UUI/tree/main/uui-core)             | [![npm version](https://badge.fury.io/js/@epam%2Fuui-core.svg)](https://www.npmjs.com/package/@epam%2Fuui)                  | Core parts of the UUI library                                                |
| [@epam/loveship](https://github.com/epam/UUI/tree/main/loveship)             | [![npm version](https://badge.fury.io/js/@epam%2Floveship.svg)](https://www.npmjs.com/package/@epam%2Floveship)             | Styled set of components in Loveship style                                   |
| [@epam/electric](https://github.com/epam/UUI/tree/main/electric)             | [![npm version](https://badge.fury.io/js/@epam%2Floveship.svg)](https://www.npmjs.com/package/@epam%2Floveship)             | Styled set of components in Electric style                                   |
| [@epam/promo](https://github.com/epam/UUI/tree/main/epam-promo)              | [![npm version](https://badge.fury.io/js/@epam%2Fpromo.svg)](https://www.npmjs.com/package/@epam%2Fpromo)                   | Styled set of components in Promo style                                      |
| [@epam/assets](https://github.com/epam/UUI/tree/main/epam-assets)            | [![npm version](https://badge.fury.io/js/@epam%2Fassets.svg)](https://www.npmjs.com/package/@epam%2Fassets)                 | contains icons set, build-in themes and their fonts                          |
| [@epam/uui-test-utils](https://github.com/epam/UUI/tree/main/test-utils)     | [![npm version](https://badge.fury.io/js/@epam%2Fuui-test-utils.svg)](https://www.npmjs.com/package/@epam%2Fuui-test-utils) | A set of helpers which facilitate creation of unit tests for UUI components. |
| [@epam/uui-editor](https://github.com/epam/UUI/tree/main/uui-editor)         | [![npm version](https://badge.fury.io/js/@epam%2Fuui-editor.svg)](https://www.npmjs.com/package/@epam%2Fuui-editor)         | [Slate.js](https://www.slatejs.org/)-based Rich Text Editor                  |
| [@epam/uui-timeline](https://github.com/epam/UUI/tree/main/uui-timeline)     | [![npm version](https://badge.fury.io/js/@epam%2Fuui-timeline.svg)](https://www.npmjs.com/package/@epam%2Fuui-timeline)     | UUI Timeline provides facilities to build a Ghant-chart like interfaces.     |

## Contribution

Contributions are the driving force behind the incredible growth and innovation in the open-source community.

For more in-depth information, we recommend reviewing our [Contribution guide](https://github.com/epam/UUI/blob/main/CONTRIBUTING.md#contributing-to-uui).
It covers [Bug reporting](https://github.com/epam/UUI/blob/main/CONTRIBUTING.md#i-have-an-issue), submitting [Improvements](https://github.com/epam/UUI/blob/main/CONTRIBUTING.md#i-have-an-idea) or [Pull Requests](https://github.com/epam/UUI/blob/main/CONTRIBUTING.md#i-want-to-submit-changes), and other related topics.

## License

[MIT](./LICENSE.md)
