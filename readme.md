<p align="center">
  <a href="https://uui.epam.com">
    <img width="400" src="https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/Images/uui-logo-readme.svg">
  </a>
</p>

React-based components and accelerators library built by EPAM Systems.

License: MIT

## Features

- Rich set of components: from buttons to data tables

- Common services: modals, notifications, error, monitoring, and more

- State-management primitives: Forms with validation, Lists and Tables with lazy-loading

- Open for contribution, actively evolving, supported, and used by 25+ EPAM internal production projects

- Allows deep customization to build your own brand UI components set on top

- Not opinionated, you don't have to all-in: it's compatible with CRA, Babel/TypeScript, LESS/SASS, Apollo/Redux.

## Getting started

We recommend to use [Create React App](https://reactjs.org/docs/create-a-new-react-app.html) to create React application.

After creating an app, you need to add uui packages:
```
yarn add @epam/assets @epam/loveship @epam/promo @epam/uui
```

UUI need application to be wrapped with ContextProvider class to properly function. You can use this file as a template: https://github.com/epam/UUI/blob/main/app/src/index.tsx

## Development

To start locally

```
git clone git@github.com:epam/UUI.git
cd uui
yarn
yarn start
```

This would open the uui.epam.com web-site locally, in watch mode.

