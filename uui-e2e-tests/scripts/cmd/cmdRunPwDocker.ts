import { spawnProcessSync, hasCliArg, isCmdSuccessful } from '../cliUtils';
import {
    CLI_ARGS, CONTAINER_ENGINES,
    DOCKER_CONTAINER_NAME,
    DOCKER_FILES,
    DOCKER_IMAGE_TAGS, ENV_FILES,
    YARN_TASKS,
} from '../constants';
import { currentMachineIpv4 } from '../ipUtils';
import { readEnvFile } from '../envFileUtils';
import { Logger } from '../../src/utils/logger';

const UUI_DOCKER_CONTAINER_MGMT = getContainerMgmtTool();

main();

function main() {
    spawnProcessSync({
        cmd: UUI_DOCKER_CONTAINER_MGMT,
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
        cmd: UUI_DOCKER_CONTAINER_MGMT,
        args: [
            'rm',
            DOCKER_CONTAINER_NAME,
        ],
        exitOnErr: false,
    });
    const updateSnapshots = hasCliArg(CLI_ARGS.PW_DOCKER_UPDATE_SNAPSHOTS);
    spawnProcessSync({
        cmd: UUI_DOCKER_CONTAINER_MGMT,
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
            'UUI_IS_DOCKER=true',
            '-e',
            `UUI_DOCKER_HOST_MACHINE_IP=${currentMachineIpv4}`,
            DOCKER_IMAGE_TAGS.TEST,
            'yarn',
            updateSnapshots ? YARN_TASKS.DOCKER_TEST_E2E_UPDATE : YARN_TASKS.DOCKER_TEST_E2E,
        ],
        exitOnErr: true,
    });
}

function getVolumesMapArgs() {
    const volumesMap: Record<string, string> = {
        './scripts': '/app/scripts',
        './src': '/app/src',
        './tests': '/app/tests',
        './playwright.config.ts': '/app/playwright.config.ts',
        './.env.ci': '/app/.env.ci',
        './.env.local': '/app/.env.local',
    };
    return Object.keys(volumesMap).reduce<string[]>((acc, key) => {
        const value = volumesMap[key];
        acc.push('-v');
        acc.push(`${key}:${value}`);
        return acc;
    }, []);
}

function getContainerMgmtTool(): string {
    const envFile = readEnvFile();
    let cmdEffective: string = envFile.UUI_DOCKER_CONTAINER_ENGINE;
    if (cmdEffective) {
        Logger.info(`The "${cmdEffective}" container engine is explicitly specified in "${ENV_FILES.LOCAL}"; It will be used.`);
        return cmdEffective;
    } else {
        const isPodmanInstalled = isCmdSuccessful({ cmd: CONTAINER_ENGINES.podman, args: ['-v'] });
        if (isPodmanInstalled) {
            Logger.info(`The "${CONTAINER_ENGINES.podman}" CLI detected.`);
            cmdEffective = CONTAINER_ENGINES.podman;
        } else {
            // fallback
            cmdEffective = CONTAINER_ENGINES.docker;
        }
        Logger.info(`No container engine is explicitly specified in "${ENV_FILES.LOCAL}"; "${cmdEffective}" will be used.`);
    }
    return cmdEffective;
}
