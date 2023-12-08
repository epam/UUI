import { extractExports } from './extractor';
import { formatExports } from './formatter';
import { saveContentToFile } from './utils/fileUtils';
import {
    OUTPUT_DTS_FILE_FULL_PATH,
    OUTPUT_FILE_FULL_PATH,
    OUTPUT_STATS_FILE_FULL_PATH,
} from './constants';
import { generateDTS } from './dts';
import { ConverterContext } from './converterContext/converterContext';
import { compareToPrevStats } from './compareStatsUtils/statsComparatorUtils';

main();

function main() {
    const context = new ConverterContext();
    const extracted = extractExports(context);
    const formatted = formatExports(extracted, context);
    const dts = generateDTS(formatted);
    saveContentToFile(OUTPUT_FILE_FULL_PATH, formatted);
    saveContentToFile(OUTPUT_DTS_FILE_FULL_PATH, dts);
    const nextStats = context.stats.getResults();
    saveContentToFile(OUTPUT_STATS_FILE_FULL_PATH, nextStats);

    // Prev stats is optional and can be passed via CLI: generate-components-api --prev-stats=../docsGenStats.json
    compareToPrevStats(nextStats);
}
