#!/usr/bin/env node

const BIN_SCRIPTS = {
    ROLLUP_BUILD: '--rollup-build',
    THEME_TOKENS: '--theme-tokens',
};
//
if (process.argv.includes(BIN_SCRIPTS.ROLLUP_BUILD)) {
    // eslint-disable-next-line import/extensions
    const { main } = require('./rollupBuild/build.js');
    main();
} else if (process.argv.includes(BIN_SCRIPTS.THEME_TOKENS)) {
    // eslint-disable-next-line import/extensions
    const { main } = require('./themeTokens/main.js');
    main();
}
