import { readEnvFile } from './envFileUtils';
import { Logger } from '../src/utils/logger';
import { CONTAINER_ENGINES, ENV_FILES } from './constants';
import { isCmdSuccessful } from './cliUtils';

export function getContainerEngineCmd(): string {
    const envFile = readEnvFile();
    let cmdEffective: string = envFile.UUI_DOCKER_CONTAINER_ENGINE;
    if (cmdEffective) {
        Logger.info(`The "${cmdEffective}" container engine is explicitly specified in "${ENV_FILES.DOCKER}"; It will be used.`);
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
        Logger.info(`No container engine is explicitly specified in "${ENV_FILES.DOCKER}"; "${cmdEffective}" will be used.`);
    }
    return cmdEffective;
}
