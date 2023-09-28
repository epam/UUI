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
import { TApiReferenceJson } from './types/docsGenSharedTypes';

main();

function main() {
    const context = new ConverterContext();
    const exportsNotFormatted = extractExports(context);
    const publicTypes = formatExports(exportsNotFormatted, context);
    const json: TApiReferenceJson = {
        publicTypes,
        refs: context.refs.get(publicTypes),
    };
    const dts = generateDTS(publicTypes);
    saveContentToFile(OUTPUT_FILE_FULL_PATH, json);
    saveContentToFile(OUTPUT_DTS_FILE_FULL_PATH, dts);
    saveContentToFile(OUTPUT_STATS_FILE_FULL_PATH, context.stats.getResults());
}
