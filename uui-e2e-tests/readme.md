### Install Podman v5.x (tested on v5.0.1)
**Windows**:
Install Podman v5.x from here: https://github.com/containers/podman/releases 
You might need to restart computer after that.

**MacOS**:
Install Podman with the command below. Please make sure that Podman version is at least ```5.0.1``` or newer. 
You might need to restart computer after that. 
```shell 
brew install podman
```

### Init Podman
```shell
podman machine init
podman machine set --user-mode-networking
podman machine start
```

### Running tests in local environment
#### Prerequisites
1. Podman is installed
2. Server is started. Possible options:
   * Local dev server (default option)
     * Pros: Convenient when you make changes to e2e tests and want to see results right away
     * Cons: Slower than other options. Occasionally dev server may stop responding which leads to test failures.
   * Local prod server
     * Pros: Good performance. Please be aware that port 5000 might be occupied on macOS by some system utilities.
     * Cons: Requires full build
   * Any external UUI server
     * Pros: Good performance (though it depends on network speed).
3. [Optional step] Change ```.env.local``` file to set non-standard UUI_APP_BASE_URL

#### NPM tasks to use
Note: If the tasks are run for the very first time, it might take some time to download necessary docker images (about 10 min).
```shell
# Run tests in docker container
yarn test-e2e

# Run tests in docker container and update all screenshots
yarn test-e2e-update

# Show report located in "uui-e2e-tests/tests/.report/report" folder
yarn test-e2e-report
```

### Useful Podman commands
The image for UUI e2e test requires about ```2.4 Gb``` of free disk space.
The following commands can help you to check how much disk space is being used.
```shell
# Show podman disk usage
podman system df

# List all images and their sizes
podman images --all

# Remove all images without at least one container associated with them
# It's a preferrable way to clean up unused images.
podman image prune --all

# Delete all images. Use it only when other methods to free up space don't help.
# When the e2e tests are run after deleting all images, all necessary dependencies will download again which takes some time.
podman rmi --all --force
```

