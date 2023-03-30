const { hasCliArg } = require('../../utils/cmdUtils.js');

function main() {
    const spawn = require('cross-spawn');
    const args = ['-c', require.resolve('./rollup.config.js')];
    if (hasCliArg('--watch')) {
        args.push('--watch');
    }
    spawn.sync('rollup', args, { encoding: 'utf8', stdio: 'inherit' });
}

module.exports = {
    main,
};
