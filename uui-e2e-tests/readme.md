### Podman installation
#### Windows
1. Install Podman from here: https://github.com/containers/podman/releases/tag/v5.0.0 Note: you might need to restart computer after that.
2. Download "Docker Compose" via Powershell (with Admin privileges)
    ```shell
    Start-BitsTransfer -Source "https://github.com/docker/compose/releases/download/v2.26.0/docker-compose-Windows-x86_64.exe" -Destination $Env:ProgramFiles\Docker\docker-compose.exe
    ```
3. Run next commands:
    ```bash
    podman machine init
    podman machine set --rootful
    podman machine set --user-mode-networking
    podman machine start
    ```

#### MacOS
1. Install Podman with command below. Note: you might need to restart computer after that.
    ```shell
    brew install podman
    ```
2. Install "Docker Compose"
    ```shell
    brew install docker-compose
    ```
3. Run next commands:
    ```shell
    podman machine init
    podman machine set --rootful
    podman machine set --user-mode-networking
    podman machine start
    ```

### Running tests in local environment
#### Prerequisites
1. Podman is installed
2. Start local dev server
3. [Optional step] Change ```./.env.local``` file in order to set non-standard UUI_APP_BASE_URL

#### NPM tasks to use
Note: If you run the tests for the very first time, it will take some time to download necessary docker images (about 8-10min).
```shell
# Run tests in docker container
yarn docker-test-e2e

# Run tests in docker container and update all screenshots
yarn docker-test-e2e-update

# Show report located in "uui-e2e-tests/tests/.report/report" folder
yarn test-e2e-report-show
```
