function main() {
    const spawn = require('cross-spawn');
    const args = ['-c', require.resolve('./rollup.config.js')];
    if (process.argv.includes('--watch')) {
        args.push('--watch');
    }
    spawn.sync('rollup', args, { encoding: 'utf8', stdio: 'inherit' });
}

module.exports = {
    main,
};
