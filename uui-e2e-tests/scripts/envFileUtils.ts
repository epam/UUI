import dotenv from 'dotenv';
import path from 'node:path';
import { ENV_FILES, HOST_IP_PH } from './constants';
import { readUuiSpecificEnvVariables } from './envParamUtils';

const { UUI_DOCKER_HOST_MACHINE_IP = 'localhost' } = readUuiSpecificEnvVariables();

type TEnvParams = {
    UUI_APP_BASE_URL: string,
    UUI_APP_BASE_URL_CI: string,
    UUI_DOCKER_CONTAINER_ENGINE: string,
};

export function readEnvFile(): TEnvParams {
    const processEnv = {} as TEnvParams;
    dotenv.config({
        processEnv,
        path: path.resolve(__dirname, '..', ENV_FILES.ENV),
    });
    if (processEnv.UUI_APP_BASE_URL) {
        const hostIp = UUI_DOCKER_HOST_MACHINE_IP;
        if (hostIp) {
            processEnv.UUI_APP_BASE_URL = processEnv.UUI_APP_BASE_URL.replace(HOST_IP_PH, hostIp);
        }
    } else {
        throw new Error(`UUI_APP_BASE_URL must be defined in ${ENV_FILES.ENV}`);
    }
    if (!processEnv.UUI_APP_BASE_URL_CI) {
        throw new Error(`UUI_APP_BASE_URL_CI must be defined in ${ENV_FILES.ENV}`);
    }
    return processEnv;
}
