import { generateDockerfile } from '../dockerTemplates/Dockerfile';
import { generateDockerCompose } from '../dockerTemplates/docker-compose.yml';
import { getCwd, spawnProcessSync, hasCliArg } from '../cliUtils';
import { CLI_ARGS, YARN_TASKS } from '../constants';

main();

export function main() {
    createDockerFiles();
    runDockerCompose();
}

function runDockerCompose() {
    spawnProcessSync({
        cmd: 'yarn',
        args: [YARN_TASKS.DOCKER],
        cwd: getCwd({ isInsideMonorepo: false }),
    });
}

function createDockerFiles() {
    const updateSnapshots = hasCliArg(CLI_ARGS.PW_DOCKER_UPDATE);
    generateDockerfile({ updateSnapshots });
    generateDockerCompose({ updateSnapshots });
}
