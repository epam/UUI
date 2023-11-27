import { processFigmaVariables } from '../figmaScripts/figmaVariablesUtils';
// @ts-ignore
import { logger } from '../utils/loggerUtils';

main();

function main() {
    try {
        processFigmaVariables();
    } catch (err) {
        logger.error(err);
        throw err;
    }
}
