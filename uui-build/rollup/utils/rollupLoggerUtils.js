module.exports = { onwarn }

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
