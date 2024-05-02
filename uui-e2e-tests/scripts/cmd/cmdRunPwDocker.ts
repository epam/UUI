import { spawnProcessSync, hasCliArg } from '../cliUtils';
import {
    CLI_ARGS,
    DOCKER_CONTAINER_NAME,
    DOCKER_FILES,
    DOCKER_IMAGE_TAGS,
    YARN_TASKS,
} from '../constants';
import { currentMachineIpv4 } from '../ipUtils';
import { getContainerEngineCmd } from '../containerEngineUtils';

const CONTAINER_ENGINE_CMD = getContainerEngineCmd();

main();

function main() {
    spawnProcessSync({
        cmd: CONTAINER_ENGINE_CMD,
        args: [
            'build',
            '-t',
            DOCKER_IMAGE_TAGS.TEST,
            '-f',
            DOCKER_FILES.DOCKER_FILE,
            '.',
        ],
        exitOnErr: true,
    });
    spawnProcessSync({
        cmd: CONTAINER_ENGINE_CMD,
        args: [
            'rm',
            DOCKER_CONTAINER_NAME,
        ],
        exitOnErr: false,
    });

    const npmTaskName = resolvePwInDockerTaskName();
    spawnProcessSync({
        cmd: CONTAINER_ENGINE_CMD,
        args: [
            'run',
            '--name',
            DOCKER_CONTAINER_NAME,
            '--cap-add',
            'SYS_ADMIN',
            '-it',
            '--network',
            'host',
            '--ipc',
            'host',
            ...getVolumesMapArgs(),
            '-e',
            `UUI_DOCKER_HOST_MACHINE_IP=${currentMachineIpv4}`,
            DOCKER_IMAGE_TAGS.TEST,
            npmTaskName,
        ],
        exitOnErr: true,
    });
}

function resolvePwInDockerTaskName() {
    if (hasCliArg(CLI_ARGS.PW_DOCKER_UPDATE_SNAPSHOTS)) {
        return YARN_TASKS.DOCKER_TEST_E2E_UPDATE;
    } else if (hasCliArg(CLI_ARGS.PW_DOCKER_PROJECT_CHROMIUM)) {
        return YARN_TASKS.DOCKER_TEST_E2E_CHROMIUM;
    }
    return YARN_TASKS.DOCKER_TEST_E2E;
}

function getVolumesMapArgs() {
    // files/folders to mount volumes
    return [
        './scripts',
        './src',
        './tests',
        './playwright.config.ts',
        './.env.docker',
        './tsconfig.json',
    ].reduce<string[]>((acc, from) => {
        const to = `/app/${from.replace('./', '')}`;
        acc.push('-v', `${from}:${to}`);
        return acc;
    }, []);
}
