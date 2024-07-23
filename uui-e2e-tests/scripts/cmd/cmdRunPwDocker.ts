import { spawnProcessSync } from '../cliUtils';
import {
    DOCKER_CONTAINER_NAME,
    DOCKER_FILES,
    DOCKER_IMAGE_TAGS, ENV_UUI_PARAMS,
    YARN_TASKS,
} from '../constants';
import { currentMachineIpv4 } from '../ipUtils';
import { getContainerEngineCmd } from '../containerEngineUtils';
import { readUuiSpecificEnvVariables } from '../envParamUtils';
import path from 'node:path';

const CONTAINER_ENGINE_CMD = getContainerEngineCmd();
const {
    UUI_TEST_PARAM_ONLY_FAILED,
    UUI_TEST_PARAM_PROJECT,
    UUI_TEST_PARAM_UPDATE_SNAPSHOTS,
} = readUuiSpecificEnvVariables();

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
            ...getEnvParamsForDocker(),
            DOCKER_IMAGE_TAGS.TEST,
            npmTaskName,
        ],
        exitOnErr: true,
    });
}

function resolvePwInDockerTaskName() {
    if (UUI_TEST_PARAM_UPDATE_SNAPSHOTS) {
        return YARN_TASKS.DOCKER_TEST_E2E_UPDATE;
    }
    return YARN_TASKS.DOCKER_TEST_E2E;
}

function getEnvParamsForDocker(): string[] {
    const env = ['-e', `${ENV_UUI_PARAMS.UUI_DOCKER_HOST_MACHINE_IP}=${currentMachineIpv4}`];
    if (UUI_TEST_PARAM_PROJECT) {
        env.push('-e', `${ENV_UUI_PARAMS.UUI_TEST_PARAM_PROJECT}=${UUI_TEST_PARAM_PROJECT}`);
    }
    if (UUI_TEST_PARAM_ONLY_FAILED) {
        env.push('-e', `${ENV_UUI_PARAMS.UUI_TEST_PARAM_ONLY_FAILED}=true`);
    }
    return env;
}

function getVolumesMapArgs() {
    const absPathToPreviewIds = forwardSlashes(path.resolve('../app/src/docs/_types/previewIds.ts'));
    // files/folders to mount volumes
    return [
        './scripts',
        './framework',
        './tests',
        './playwright.config.ts',
        './.env',
        './tsconfig.json',
    ].reduce<string[]>((acc, from) => {
        const to = `/e2e/${from.replace('./', '')}`;
        acc.push('-v', `${forwardSlashes(path.resolve(from))}:${to}`);
        return acc;
    }, []).concat(['-v', `${absPathToPreviewIds}:/app/src/docs/_types/previewIds.ts`]);
}

function forwardSlashes(pathStr: string) {
    return pathStr.replace(/\\/g, '/');
}
