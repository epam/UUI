#!/usr/bin/env node

const ARGS = {
    ROLLUP_BUILD: '--rollup-build',
};

if (process.argv.includes(ARGS.ROLLUP_BUILD)) {
    const { main } = require('./rollupBuild/build.js');
    main();
}
