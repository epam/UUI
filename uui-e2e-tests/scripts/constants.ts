export const CLI_ARGS = {
    PW_DOCKER_UPDATE_SNAPSHOTS: '--update-snapshots',
};
export const YARN_TASKS = {
    DOCKER_TEST_E2E: 'docker-test-e2e',
    DOCKER_TEST_E2E_UPDATE: 'docker-test-e2e-update',
};
export const DOCKER_IMAGE_TAGS = {
    TEST: 'uui-e2e-test',
};
export const DOCKER_FILES = {
    DOCKER_FILE: 'e2e.Dockerfile',
};
export const DOCKER_CONTAINER_NAME = 'container-uui-e2e-tests';

export const HOST_IP_PH = '{{HOST_NAME}}';

export const ENV_FILES = {
    CI: '.env.ci',
    DOCKER: '.env.docker',
};

export const CONTAINER_ENGINES = {
    docker: 'docker',
    podman: 'podman',
};
