<p align="center">
  <a href="https://uui.epam.com">
    <img width="400" src="https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/Images/uui-logo-readme.svg">
  </a>
</p>

React-based components and accelerators library built by EPAM Systems.

Check out [UUI website](https://uui.epam.com) for [demo](https://uui.epam.com/demo) and [documentation](https://uui.epam.com/documents?id=overview&mode=doc&skin=UUI4_promo).

Alternatively, you can get started by using a pre-configured template on Codesandbox
    <a href="https://codesandbox.io/s/uui-w4i61" style="position: relative; top: 10px; left: 5px;">
        <img
            width="30"
            height="30"
            alt="Codesandbox"
            src="https://camo.githubusercontent.com/ccf186cd931b6a61cf49bd0a3aeacb2d73be7e91210453571bdcf9f5b1057173/687474703a2f2f63646e2e656d6265642e6c792f70726f7669646572732f6c6f676f732f636f646573616e64626f782e706e67"
        />
    </a>

License: MIT

## Features

- Rich set of components: from buttons to data tables

- Common services: modals, notifications, error, monitoring, and more

- State-management primitives: Forms with validation, Lists and Tables with lazy-loading

- Open for contribution, actively evolving, supported, and used by 25+ EPAM internal production projects

- Allows deep customization to build your own brand UI components set on top

- Not opinionated, you don't have to all-in: it's compatible with CRA, Babel/TypeScript, LESS/SASS, Apollo/Redux.

## Install

```
yarn add @epam/uui @epam/components @epam/loveship
```

## Getting started

We recommend to use our custom [UUI template](https://www.npmjs.com/package/@epam/cra-template-uui) for [Create React App](https://reactjs.org/docs/create-a-new-react-app.html) to create React application with already configured environment.

```sh
npx create-react-app my-app --template @epam/uui

# or

yarn create react-app my-app --template @epam/uui
```

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

