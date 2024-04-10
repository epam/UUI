import rollup, { OutputOptions, RollupBuild, RollupOptions, RollupWatcherEvent } from 'rollup';
import { withEventsLogger } from './buildProgressUtils';
import { getIndexFileRelativePath, logger } from '../../../utils/jsBridge';
// @ts-ignore
import { createRollupConfigForModule } from '../../../../rollup/rollup.config.js';

interface IRollupBuildBaseParams {
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

interface IRollupBuildParams extends IRollupBuildBaseParams {
    /**
     * pass true to start rollup watcher
     */
    isWatch?: boolean;
}

/**
 * Builds module using Rollup.
 */
export async function buildModuleUsingRollup(options: IRollupBuildParams): Promise<void> {
    const {
        moduleRootDir, external, copyAsIs, packageJsonTransform, isWatch,
    } = options;
    const asyncCallback = async () => {
        const params = {
            moduleRootDir, external, packageJsonTransform, copyAsIs,
        };
        if (isWatch) {
            await watchUsingRollup(params);
        } else {
            await buildUsingRollup(params);
        }
    };
    if (isWatch) {
        // Don't log anything, because Rollup watcher already does it.
        return await asyncCallback();
    }
    await withEventsLogger({ moduleRootDir, isRollup: true, asyncCallback });
}

/**
 * Starts Rollup build for the given module
 */
async function buildUsingRollup(params: IRollupBuildBaseParams): Promise<void> {
    const cfg = await getConfigEffective({ ...params, isWatch: false });
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
 * TBD: Is it needed?
 * Starts Rollup watcher for the given module
 */
async function watchUsingRollup(params: IRollupBuildBaseParams): Promise<void> {
    const cfg = await getConfigEffective({ ...params, isWatch: true });
    const watcher = rollup.watch(cfg);
    watcher.on('event', (event: RollupWatcherEvent) => {
        const { code } = event;
        switch (code) {
            case 'START': {
                logger.success(`Watcher started: ${params.moduleRootDir}`);
                break;
            }
            case 'BUNDLE_START': {
                logger.info(`Compiling: ${params.moduleRootDir}`);
                break;
            }
            case 'BUNDLE_END': {
                logger.info(`Compiling done: ${params.moduleRootDir}`);
                break;
            }
            case 'ERROR': {
                logger.error(`Compile error: ${params.moduleRootDir}`);
                break;
            }
        }
        if (code === 'BUNDLE_END' || code === 'ERROR') {
            event.result?.close();
        }
    });
}

/**
 * Creates rollup config for the module
 */
async function getConfigEffective(params: IRollupBuildParams): Promise<RollupOptions[]> {
    const {
        moduleRootDir, external, isWatch, packageJsonTransform, copyAsIs,
    } = params;
    const indexFileRelativePath = await getIndexFileRelativePath(moduleRootDir);
    return await createRollupConfigForModule({
        moduleRootDir,
        indexFileRelativePath,
        external,
        isWatch,
        packageJsonTransform,
        copyAsIs,
    });
}
