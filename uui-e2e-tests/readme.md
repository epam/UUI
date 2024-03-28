### Podman installation
#### Windows
1. Open https://github.com/containers/podman/releases/tag/v5.0.0
2. Scroll to the bottom of the page and download ```podman-5.0.0-setup.exe```. Install it.
3. Open PowerShell console as Administrator and run next commands:
```bash
podman machine init
podman machine set --rootful
podman machine set --user-mode-networking
podman machine start
```

#### MacOS
// TBD

### Running tests in local environment
#### Prerequisites
1. Podman is installed
2. Start local dev server
3. [Optional step] Change ```./.env.local``` file in order to set non-standard UUI_APP_BASE_URL

#### NPM tasks to use
Note: If you run the tests for the very first time, it will take some time to download necessary docker images (about 8-10min).
```bash
# Run tests in docker container
yarn docker-test-e2e

# Run tests in docker container and update all screenshots
yarn docker-test-e2e-update

# Show report located in "uui-e2e-tests/tests/.report/report" folder
yarn test-e2e-report-show
```
