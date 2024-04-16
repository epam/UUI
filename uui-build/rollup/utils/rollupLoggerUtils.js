const os = require('os');
const { logger } = require('../../utils/loggerUtils');

module.exports = { onwarn };

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
            if (message.plugin === 'typescript' && message.code === 'PLUGIN_WARNING') {
                // we should really print it as an error
                const { loc } = message;
                const locFormatted = loc ? `at ${loc.file}:${loc.line}:${loc.column}` : '';
                const msg = `${message.message}${os.EOL}${locFormatted}`;
                logger.error(msg);
            } else {
                console.warn(message.message, message);
            }
            break;
        }
    }
}
