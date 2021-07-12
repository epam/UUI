<p align="center">
  <a href="https://uui.epam.com">
    <img width="400" src="https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/Images/uui-logo-readme.svg">
  </a>
</p>

React-based components and accelerators library built by EPAM Systems.

Check out [UUI website](https://uui.epam.com) for [demo](https://uui.epam.com/demo) and [documentation](https://uui.epam.com/documents?id=overview&mode=doc&skin=UUI4_promo).

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

As an option, you can get started by using a template on [Codesandbox](https://codesandbox.io/s/uui-w4i61) with already pre-configured environment.

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

