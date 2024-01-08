import path from 'path';
import { uuiRoot } from '../../constants';

export const APP_TEMPLATE_DIR = './templates/uui-cra-template';
export const TEMPLATE_APP_TARGET_DIR = './.templates/uui-cra-template/app';
export const APP_TARGET_DIR = './app';

export const COLLECT_SIZE_GLOB = {
    APP: {
        JS: 'build/static/**/*.js',
        CSS: 'build/static/**/*.css',
    },
    MODULE: {
        JS: 'build/index.esm.js',
        CSS: 'build/styles.css',
    },
};
export const BASE_LINE_PATH = './uui-build/config/bundleSizeBaseLine.json';
export const COMPARISON_THRESHOLD_PERCENTAGE = 10;
export const TRACK_BUNDLE_SIZE_REPORT_MD = './.reports/trackBundleSize.md';

export const UNTRACKED_MODULES = ['@epam/uui-test-utils'];

export const appTargetDirResolved = path.resolve(uuiRoot, TEMPLATE_APP_TARGET_DIR);
export const epamPrefix = '@epam/';

export const CLI = {
    buildApp: { cmd: 'npm', args: ['run', 'build'] },
    createAppFromTemplate: {
        cmd: 'npx',
        args: [
            'create-react-app', TEMPLATE_APP_TARGET_DIR, '--template', `file:${APP_TEMPLATE_DIR}`,
        ],
    },
};
