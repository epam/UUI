const MagicString = require('magic-string');

const PURE_ANNOTATION = '/* @__PURE__ */';
const PLUGIN_NAME = 'annotate-pure-function-calls-plugin';

module.exports = annotatePureFunctionCallsPlugin;

/**
 * THis plugin only changes the resulting chunks only.
 * It adds @__PURE__ annotation before every function call listed in the pureFunctions parameter.
 *
 * @param pluginOpts
 * @param pluginOpts.pureFunctions
 * @param pluginOpts.sourcemap
 */
function annotatePureFunctionCallsPlugin(pluginOpts = { pureFunctions: [] }) {
    const { pureFunctions = [] } = pluginOpts;
    if (!pureFunctions?.length) {
        throw new Error(`[${PLUGIN_NAME}] 'pureFunctions' parameter is mandatory`);
    }

    const replaceWhat = new RegExp(
        `(=|export default)(\\s)+(?<!${escapeForRegex(PURE_ANNOTATION)})(${pureFunctions.map(escapeForRegex).join('|')})(<.+>)?(\\()`,
        'g',
    );
    const replaceTo = `$1$2${PURE_ANNOTATION}$3$4$5`;

    return {
        name: PLUGIN_NAME,
        transform(code) {
            const codeAfterReplace = code.replace(replaceWhat, replaceTo);
            if (codeAfterReplace !== code) {
                const magicString = new MagicString(codeAfterReplace);
                const result = { code: magicString.toString() };
                if (pluginOpts.sourcemap) {
                    result.map = magicString.generateMap({ hires: true });
                }
                return result;
            }
            return null;
        },
    };
}

function escapeForRegex(str) {
    return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}
