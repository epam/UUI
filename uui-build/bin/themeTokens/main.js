module.exports = {
    main,
};

function main() {
    const spawn = require('cross-spawn');
    // We only allow to generate mixins here
    const args = [
        'ts/scripts/themeTokensGen.ts',
        getCliArgStartWith('--src-collection='),
        getCliArgStartWith('--out-mixins='),
    ];
    spawn.sync('ts-node', args, { encoding: 'utf8', stdio: 'inherit' });
}

function getCliArgStartWith(prefix) {
    return [...process.argv].find((s) => s.indexOf(prefix) === 0) || '';
}
