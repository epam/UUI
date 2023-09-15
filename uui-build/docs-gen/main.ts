import { extractExports } from './exportsExtractor';
import { formatExports } from './exportsFormatter';
import { saveContentToFile } from './utils';
import { OUTPUT_DTS_FILE_FULL_PATH, OUTPUT_FILE_FULL_PATH } from './constants';
import { generateDTS } from './dtsGenerator';

main();

function main() {
    const exports = extractExports();
    const json = formatExports(exports);
    const dts = generateDTS(json);
    saveContentToFile(OUTPUT_FILE_FULL_PATH, json);
    saveContentToFile(OUTPUT_DTS_FILE_FULL_PATH, dts);
}
