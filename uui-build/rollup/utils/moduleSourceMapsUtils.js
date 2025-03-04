const path = require('path');

module.exports = { getSourceMapTransform };

function forwardSlashes(pathStr) {
    return pathStr.replace(/\\/g, '/');
}

/**
 * It's needed to fix sources location path in "build/index.js.map" and "build/styles.css.map".
 */
function getSourceMapTransform({ type, moduleName, moduleFolderName }) {
    return function sourcemapPathTransform(relativeSourcePathParam) {
        const relativeSourcePath = forwardSlashes(relativeSourcePathParam);
        const PROTOCOL = 'rollup://'; // decide what protocol we need to use here "webpack://" or "rollup://" or anything else?
        const BASE_MODULE_PREFIX = `${PROTOCOL}${moduleName}/`;
        const PREFIX = `${BASE_MODULE_PREFIX}./`;
        switch (type) {
            case 'css': {
                /**
                 * It is generated relative to ./build folder of the module.
                 * Known use cases, and how it will be transformed:
                 * a) "sources":["../src/components/widgets/AvatarStack.scss",...] --> "sources":["rollup://<moduleName>/./src/components/widgets/AvatarStack.scss",...]
                 * b) "sources":["../node_modules/@epam/assets/scss/typography.scss",...] --> "sources":["rollup://@epam/assets/scss/promo/typography.scss",...]
                 */
                if (relativeSourcePath.indexOf('../node_modules/') === 0) {
                    return PROTOCOL + relativeSourcePath.substring('../node_modules/'.length);
                }
                return PREFIX + forwardSlashes(path.join('./build', relativeSourcePath));
            }
            case 'js': {
                /**
                 * It's relative to ./build folder, but it's not consistent where it starts. Known cases:
                 * - start from module root ("../src/icons/bold.svg")
                 * - start from monorepo root ("../../src/Test.tsx"). It's because the TS compiler works this way.
                 * Known use cases, and how it will be transformed:
                 * "sources":["../../src/Test.tsx",...] --> "sources":["rollup://<moduleName>/./src/Test.tsx",...]
                 * "sources":["../src/icons/bold.svg",...] --> "sources":["rollup://<moduleName>/./src/icons/bold.svg",...]
                 */

                if (relativeSourcePath.indexOf('../../') === 0) {
                    return PREFIX + forwardSlashes(path.join(`${moduleFolderName}/build`, relativeSourcePath));
                } else if (relativeSourcePath.indexOf('../') === 0) {
                    return PREFIX + forwardSlashes(path.join('./build', relativeSourcePath));
                } else {
                    return relativeSourcePath;
                }
            }
            default: {
                throw new Error(`Unknown type=${type}`);
            }
        }
    };
}
