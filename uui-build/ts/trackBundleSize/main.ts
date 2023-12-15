/**
 * This script is used for bundle size tracking to prevent accidental bundle size regression.
 * The generated reports can be compared with each other in order to detect any regression in bundle size.
 */
import { createSimpleWorkflow } from './utils/simpleWorkflow';
import { buildAllModules } from './steps/buildAllModules';
import { createCraFromUuiTemplate } from './steps/createCraFromUuiTemplate';
import { symlinkAppDependencies } from './steps/symlinkAppDependencies';
import { fixCraConfig } from './steps/fixCraConfig';
import { buildTemplateApp } from './steps/buildTemplateApp';
import { TTrackBsParams } from './types';
import { checkPackagesSize } from './steps/checkPackagesSize';
import { hasCliArg } from '../jsBridge';

export async function main() {
    const overrideBaseline = Boolean(hasCliArg('--override-baseline'));
    await trackBundleSize({ overrideBaseline });
}

/**
 * Generate report which contains sizes of all packages as well as diff with baseline sizes.
 * More specifically, it does the following:
 * - Build react app from the local UUI template. All local UUI dependencies will be symlinked to this app.
 * - Build the template app.
 * - Use source-map-explorer to collect total size of all local UUI packages and size of the template app.
 * - Generate report at: ./.reports/*
 */
async function trackBundleSize(params: TTrackBsParams) {
    const tasks = createSimpleWorkflow<TTrackBsParams>({
        buildAllModules,
        createCraFromUuiTemplate,
        symlinkAppDependencies,
        fixCraConfig,
        buildTemplateApp,
        checkPackagesSize,
    });
    await tasks.run(params);
}
