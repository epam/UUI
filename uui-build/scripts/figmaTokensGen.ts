import { genFigmaTokens } from '../figmaTokensGen/figmaTokensGen';
// @ts-ignore
import { logger } from '../utils/loggerUtils';

main();

function main() {
    try {
        genFigmaTokens();
    } catch (err) {
        logger.error(err);
        throw err;
    }
}
