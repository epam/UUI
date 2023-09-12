import { extractExports } from './exportsExtractor';
import { formatExports } from './exportsFormatter';
import { saveJsonToFile } from './utils';
import { OUTPUT_FILE_FULL_PATH } from './constants';

main();

function main() {
    const exports = extractExports();
    const json = formatExports(exports);
    saveJsonToFile(OUTPUT_FILE_FULL_PATH, json);
}
