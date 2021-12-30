# Getting started

## Recommended software:
- Node 8.12.0 or later (https://nodejs.org/en/)
- VSCode (https://code.visualstudio.com/), or other IDE with typescript support (like WebStorm)
- yarn package manager (https://yarnpkg.com/en/)
- Any GIT client (standalone, or embedded into your IDE)

## Running the project with template

Clone the repository.

To build and then start the project use:
```
yarn
yarn start
```
Then open your browser on http://localhost:3000/


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

# Build configuration

## CSS/SCSS Modules

We build styles using SCSS in combination with CSS modules.

If you have the following MyComponent.module.scss file:
```
.my-header {
    color: red;
}
```
You can import and use selectors from it from your tsx file:
```
import * as React from 'react';
import * as css from './MainPage.module.scss';

export const MyComponent = <div className={ css.mainPanel }>
```
css.mainPanel will be equal to auto-generated class name, which is guaranteed to be unique across the project. In development mode, selector will contain the name of the file and hash, like "MainPage_mainPanel__140Pj". In production mode, selectors will be made short to reduce size.

If you need an usual global selector, use:
```
:global(.my-selector)
```

Read more on CSS Modules here: https://github.com/css-modules/css-modules 

Read more on SCSS here: https://sass-lang.com/ 

## SVG icons

SVG files can be imported like this:
```
import { ReactComponent as myIcon } from 'icons/myIcon.svg'
```

After this, myIcon.svg will be included in SVG sprite as a symbol, and myIcon variable will contain and object with meta-information about the SVG file, like { id, url, viewBox } or like React.SFC.

[comment]: <> (## Working the .NET/Java server)

[comment]: <> (By default, the project is configured to run without the server &#40;like .NET/Java-based REST APIs&#41;.)

[comment]: <> (Usually, back-end project serves static assets as well as it's REST APIs. Considering this, when you'll get back-end server running, you need to change some settings:)

[comment]: <> (- make sure your server can serve static files from /built path.)

[comment]: <> (- the app uses Single Page Application approach, so routing is done at client-side. To support this, you'll need to tweak your server-side routing so any unknown path &#40;like /home&#41; serves the /built/index.html file content)

[comment]: <> (- on developers machines, setup the server to run on some spare port &#40;like 44301&#41;)

[comment]: <> (- Back-end developers can use "yarn build" after getting the source, to get recent version of UI scripts)

[comment]: <> (- On your build/CI script use "yarn prod" command to build the bundle.js.)

# Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn about UII, visit [UUI documentation website](https://uui.epam.com/)

To learn React, check out the [React documentation](https://reactjs.org/).
