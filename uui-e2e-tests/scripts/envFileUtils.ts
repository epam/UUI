import dotenv from 'dotenv';
import path from 'node:path';
import { readEnvParams } from './cliUtils';

const { isCi, UUI_APP_BASE_URL_FALLBACK } = readEnvParams();

const envFileName = isCi ? '.env' : '.env.local';

type TEnvParams = { UUI_APP_BASE_URL: string };

export function readEnvFile(): TEnvParams {
    const processEnv = {} as TEnvParams;
    dotenv.config({
        processEnv,
        path: path.resolve(__dirname, '..', envFileName),
    });

    if (!processEnv.UUI_APP_BASE_URL) {
        if (UUI_APP_BASE_URL_FALLBACK) {
            processEnv.UUI_APP_BASE_URL = UUI_APP_BASE_URL_FALLBACK;
        } else {
            throw new Error(`UUI_APP_BASE_URL must be defined in ${envFileName}`);
        }
    }
    return processEnv;
}
