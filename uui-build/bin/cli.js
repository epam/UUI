#!/usr/bin/env node

const BIN_SCRIPTS = {
    ROLLUP_BUILD: '--rollup-build',
    GENERATE_THEME_VARIABLES: '--generate-theme-variables',
};
//
if (process.argv.includes(BIN_SCRIPTS.ROLLUP_BUILD)) {
    // eslint-disable-next-line import/extensions
    const { main } = require('./rollupBuild/build.js');
    main();
} else if (process.argv.includes(BIN_SCRIPTS.GENERATE_THEME_VARIABLES)) {
    // eslint-disable-next-line import/extensions
    const { main } = require('./generateThemeVariables/main.js');
    main();
} else {
    console.error(`[ERROR] Unknown command. List of supported commands: ${Object.values(BIN_SCRIPTS).map((c) => `"${c}"`).join(', ')}.`);
}
