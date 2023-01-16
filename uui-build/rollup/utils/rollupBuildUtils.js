const path = require("path");
module.exports = { onwarn, getSourceMapTransform };

/**
 * Handles Rollup build warnings.
 * @param message
 */
function onwarn(message) {
    switch (message?.code) {
        case 'CIRCULAR_DEPENDENCY': {
            // skip for now, uncomment to see how many we have.
            // console.warn(message.message)
            break;
        }
        default: {
            console.warn(message.message)
            break;
        }
    }
}

/**
 * It's needed to fix sources location path in "build/index.js.map" and "build/styles.css.map".
 */
function getSourceMapTransform({ type, moduleName, moduleFolderName }) {
    return function sourcemapPathTransform(relativeSourcePath) {
        const PREFIX = `rollup://${moduleName}/./`;
        switch (type) {
            case "css": {
                /**
                 * Before:
                 * "sources":["src/components/widgets/AvatarStack.scss",...]
                 * After:
                 * "sources":["rollup://<moduleName>/./src/components/widgets/AvatarStack.scss",...]
                 */
                return PREFIX + relativeSourcePath;
            }
            case "js": {
                /**
                 * Before:
                 * "sources":["../../src/Test.tsx",...]
                 * After:
                 * "sources":["rollup://<moduleName>/./src/Test.tsx",...]
                 */
                return PREFIX + path.join(`${moduleFolderName}/build`, relativeSourcePath);
            }
            default: {
                throw new Error(`Unknown type=${type}`)
            }
        }
    }
}
