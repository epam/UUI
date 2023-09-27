import { extractExports } from './extractor';
import { formatExports } from './formatter';
import { saveContentToFile } from './utils/fileUtils';
import {
    OUTPUT_DTS_FILE_FULL_PATH,
    OUTPUT_FILE_FULL_PATH,
    OUTPUT_FILE_HIGHLIGHTED_FULL_PATH,
    OUTPUT_STATS_FILE_FULL_PATH,
} from './constants';
import { generateDTS } from './dts';
import { ConverterContext } from './converterContext/converterContext';
import { TResultJson } from './types/docsGenSharedTypes';
import { highlightTsCode } from './highlighter';

main();

function main() {
    const context = new ConverterContext();
    const exportsNotFormatted = extractExports(context);
    const byModule = formatExports(exportsNotFormatted, context);
    const json: TResultJson = {
        byModule,
        references: context.references.get(),
    };
    const dts = generateDTS(byModule);
    const jsonHighlighted = highlightTsCode(json);
    saveContentToFile(OUTPUT_FILE_FULL_PATH, json);
    saveContentToFile(OUTPUT_FILE_HIGHLIGHTED_FULL_PATH, jsonHighlighted);
    saveContentToFile(OUTPUT_DTS_FILE_FULL_PATH, dts);
    saveContentToFile(OUTPUT_STATS_FILE_FULL_PATH, context.stats.getResults());
}
