const APP_TEMPLATE_DIR = './templates/uui-cra-template';
const TEMPLATE_APP_TARGET_DIR = './.templates/uui-cra-template/app';
const APP_TARGET_DIR = './app';
const COLLECT_SIZE_GLOB = {
    APP: 'build/static/{js,css}/**/*.{js,css}',
    MODULE: 'build/**/*.{js,css}',
}
const BASE_LINE_PATH = './uui-build/config/bundleSizeBaseLine.json';
const COMPARISON_THRESHOLD_PERCENTAGE = 10;
const TRACK_BUNDLE_SIZE_REPORT_MD = './.reports/trackBundleSize.md'

module.exports = {
    BASE_LINE_PATH,
    COLLECT_SIZE_GLOB,
    APP_TEMPLATE_DIR,
    TEMPLATE_APP_TARGET_DIR,
    APP_TARGET_DIR,
    COMPARISON_THRESHOLD_PERCENTAGE,
    TRACK_BUNDLE_SIZE_REPORT_MD,
};
