import fs from 'node:fs';
import path from 'node:path';
import { DOCKER_FILES, DOCKER_IMAGE_NAMES } from '../constants';
import { ip } from 'address';

const template = (params: { imageName: string, baseUrlFallback: string }) => (`
services:
    ${params.imageName}:
        environment:
            - UUI_IS_DOCKER=true
            - UUI_APP_BASE_URL_FALLBACK=${params.baseUrlFallback}
        ipc: host
        build:
            context: .
            dockerfile: ./.Dockerfile
        network_mode: host
        volumes:
            - ./scripts:/app/scripts
            - ./src:/app/src
            - ./tests:/app/tests
            - ./playwright.config.ts:/app/playwright.config.ts
            - ./.env:/app/.env
            - ./.env.local:/app/.env.local
`);

export function generateDockerCompose(params: { updateSnapshots: boolean }) {
    const imageName = params.updateSnapshots ? DOCKER_IMAGE_NAMES.TEST_UPDATE : DOCKER_IMAGE_NAMES.TEST;
    const currentMachineIpv4 = ip();
    const baseUrlFallback = currentMachineIpv4 ? `http://${currentMachineIpv4}:3000` : '';
    const content = template({ imageName, baseUrlFallback });
    fs.writeFileSync(path.resolve('./', DOCKER_FILES.DOCKER_COMPOSE), content.trim());
}
