### Start the Project

1. Clone GitHub repository:

```
git clone git@github.com:epam/UUI.git
```

2. Install root and server dependencies:

```
yarn
cd ./server
yarn
```
3. Go back to root and build server and run the App:

```
yarn build-server
yarn start
```

This will open the uui.epam.com website locally, in watch mode.

### Build UUI packages
```
yarn build
```

### Run tests

#### Unit tests

Run unit tests:
```
yarn test
//or watch mode
yarn test-watch
```
------

Update snapshots:
```
yarn test-update
```
------

Generate test report:
```
yarn test-report
```
This will generate test report into .reports/unit-tests folder

#### E2E and screenshot tests
Read this [guide](../uui-e2e-tests/readme.md).

### Generate Property explore data and API references
To generate the metadata which is used to build PE pages and API blocks
```
yarn generate-components-api
```

### Generate themes core tokens
To build Themes core css-variables(epam-assets/theme/variables/tokens) from Figma JSON

1. Place exported from Figma file `Theme.json` into `public/docs/figmaTokensGen` folder
2. Run `yarn generate-theme-tokens` command

### Track bundle sises
This is needed to check if current branch changes do not exceed UUI packages sizes baseline.
Used to notify if some changes significantly increase package size.
This is a part of PR quality check.

- To run this, check locally run:
```
yarn track-bundle-size
```

- To override baseline with current size values (Run it only if you sure that new package sizes are expected):
```
yarn track-bundle-size-override
```




