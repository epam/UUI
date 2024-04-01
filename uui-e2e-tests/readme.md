### Podman installation
#### Windows
1. Install Podman from here: https://github.com/containers/podman/releases/tag/v5.0.0 Note: you might need to restart computer after that.
2. Run next commands:
    ```bash
    podman machine init
    podman machine set --rootful=false
    podman machine set --user-mode-networking
    podman machine start
    ```

#### MacOS
1. Install Podman with command below. Note: you might need to restart computer after that.
    ```shell
    brew install podman
    ```
2. Run next commands:
    ```shell
    podman machine init
    podman machine set --rootful=false
    podman machine set --user-mode-networking
    podman machine start
    ```

### Running tests in local environment
#### Prerequisites
1. Podman is installed
2. Start local dev server
3. [Optional step] Change ```./.env.local``` file in order to set non-standard UUI_APP_BASE_URL

#### NPM tasks to use
Note: If the tasks are run for the very first time, it might take some time to download necessary docker images (about 10 min).
```shell
# Run tests in docker container
yarn local-test-e2e

# Run tests in docker container and update all screenshots
yarn local-test-e2e-update

# Show report located in "uui-e2e-tests/tests/.report/report" folder
yarn local-test-e2e-report-show
```

### Useful Podman commands
The image for UUI e2e test requires about ```2.2 Gb``` of free disk space.
The following commands can help you to check how much disk space is being used.
```
# Show podman disk usage
podman system df

# List all images and their sizes
podman images --all

# Remove all images without at least one container associated with them
# It's a preferrable way to clean up unused images.
podman image prune --all

# Delete all images. Usually it should not be used. 
# When the e2e tests are run after deleting all images, all necessary dependencies will download again which will take some time.
podman rmi --all --force
```
