import fs from 'node:fs';
import path from 'node:path';
import { DOCKER_FILES, YARN_TASKS } from '../constants';

const template = (params: { cmd: string }) => (`
FROM mcr.microsoft.com/playwright:v1.42.1-jammy

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./

RUN yarn

CMD [ ${params.cmd} ]
`);

export function generateDockerfile(params: { updateSnapshots: boolean }) {
    const { updateSnapshots } = params;
    const cmd: string[] = ['yarn'];
    cmd.push(updateSnapshots ? YARN_TASKS.TEST_E2E_UPDATE : YARN_TASKS.TEST_E2E);
    const content = template({
        cmd: cmd.map((c) => `"${c}"`).join(', '),
    });

    fs.writeFileSync(path.resolve('./', DOCKER_FILES.DOCKER_FILE), content.trim());
}
