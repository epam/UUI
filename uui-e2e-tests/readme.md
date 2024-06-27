# UUI e2e tests package

This package is a part of [EPAM UUI](https://github.com/epam/UUI) library.

This is internal package for e2e testing of UUI.


## Install container management tool
### Windows
#### Option 1: Podman v5.x
1. Install Podman v5.x from here: https://github.com/containers/podman/releases 
You might need to restart computer after that.
2. Init Podman
    ```shell
    podman machine init
    podman machine set --user-mode-networking
    podman machine start
    ```
3. Note: Podman will be used automatically (via "podman" CLI command) when Podman installation is detected
4. Useful Podman commands. The image for UUI e2e test requires about ```2.4 Gb``` of free disk space. The following commands can help you to check how much disk space is being used.
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
   
    # In case of some weird issues, you might need to remove the Podman machine using commands below. 
    # After that, you need to init Podman again (See "Init Podman" section above).
    podman machine stop
    podman machine rm
    ```

### macOS
#### Option 1: Colima
1. Install Colima via CLI:
    ```shell 
    # Install "docker" because Colima needs docker CLI client. Colima does not use docker to run containers.
    brew install docker
    
    # Install Colima itself
    brew install colima
    
    # Start
    colima start
    ```
2. Note: Colima will be used automatically (via "docker" CLI command) unless Podman installation is detected

#### Option 2: Podman v5.x (only for ARM processors - because chromium engine crashes on combination: macOS + Intel + Podman)
1. Install Podman with the command below. Please make sure that Podman version is at least ```5.0.1``` or newer. You might need to restart computer after that.
    ```shell 
    brew install podman
    ```
2. Other steps are the same as for Windows (see above)

### Usage of alternative tools not mentioned in this guide
By default, if "podman" is detected, then it is used to build/run containers; otherwise "docker" is used as fallback;
To override the default behavior, you might explicitly specify any tool via ```.env``` file using ```UUI_DOCKER_CONTAINER_ENGINE=<cmd>``` option.
Please make sure that this tool is compatible with Docker's CLI.

## Run tests locally (via Docker)
### Prerequisites
1. Server is started. Possible options:
   * Local dev server **(this is default option)**
     * Pros: Convenient when you make changes to e2e tests and want to see results right away
     * Cons: Slower than other options. Occasionally dev server may stop responding which leads to test failures.
   * Local prod server
     * Pros: Good performance.
     * Cons: Requires full build. Port ```5000``` might be occupied on macOS by some system utilities.
   * Any external UUI server
     * Pros: Good performance (though it depends on network speed).
2. [Optional step] Change ```.env``` file to set non-standard ```UUI_APP_BASE_URL```

## NPM tasks to use
Note: If the tasks are run for the very first time, it might take some time to download necessary docker images (up to 10 min, depends on network speed).
```shell
# Run only "chromium" tests in docker container
# NOTE: It is preferable for local dev environment
yarn test-e2e-chromium

# Run all tests in docker container
yarn test-e2e

# Run all tests in docker container and update all screenshots
yarn test-e2e-update

# Show report located in "uui-e2e-tests/tests/.report/report" folder
yarn test-e2e-open-report
```

## Run tests locally (without Docker)
> Important note. Our baseline screenshots are generated on Linux; and the generated screenshots differ for different OS/platform. This is why Docker has to be used on non-Linux computers to run the screenshots tests. 

Cases when you can run tests without Docker:
- on Linux
- on CI (if it already uses Linux)
- for debugging

Here is the steps:
```shell
# 1. install the engines (it can be done only once)
yarn --cwd uui-e2e-tests local-test-e2e-deps-install
# 2. run the tests locally
yarn --cwd uui-e2e-tests local-test-e2e
```
