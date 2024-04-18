import rollup, { OutputOptions, RollupBuild, RollupOptions } from 'rollup';
import { withEventsLogger } from './buildProgressUtils';
import { getIndexFileRelativePath } from '../../../utils/jsBridge';
// @ts-ignore
import { createRollupConfigForModule } from '../../../../rollup/rollup.config.js';

interface IRollupBuildParams {
    /**
     * "absolute" path to the module root dir
     */
    moduleRootDir: string;
    /**
     * array of file/folder names in the module root dir
     * which must be copied to the output "as-is" (except for package.json which is always copied anyway).
     */
    copyAsIs: string[];
    /**
     * pass a callback if you need to override default behavior for external modules
     */
    external?: (params: { moduleRootDir: string }) => string[];
    /**
     * callback if content of copied package.json needs to be adjusted
     */
    packageJsonTransform: (content: Record<string, unknown>) => object;
}

/**
 * Builds module using Rollup.
 */
export async function buildModuleUsingRollup(options: IRollupBuildParams): Promise<void> {
    const { moduleRootDir } = options;
    const asyncCallback = async () => {
        await buildUsingRollup(options);
    };
    await withEventsLogger({ moduleRootDir, isRollup: true, asyncCallback });
}

/**
 * Starts Rollup build for the given module
 */
async function buildUsingRollup(params: IRollupBuildParams): Promise<void> {
    const cfg = await getConfigEffective(params);
    const { output: outputConfig, ...inputConfig } = cfg[0];
    let bundle: RollupBuild;
    const cleanup = async () => {
        bundle && (await bundle.close());
    };
    try {
        bundle = await rollup.rollup({ ...inputConfig });
        await Promise.all((outputConfig as OutputOptions[]).map(bundle.write));
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        await cleanup();
    }
}

/**
 * Creates rollup config for the module
 */
async function getConfigEffective(params: IRollupBuildParams): Promise<RollupOptions[]> {
    const indexFileRelativePath = await getIndexFileRelativePath(params.moduleRootDir);
    return await createRollupConfigForModule({
        ...params,
        isWatch: false,
        indexFileRelativePath,
    });
}
