module.exports = {
    main,
};

function main() {
    const spawn = require('cross-spawn');
    // We only allow to generate mixins here
    const args = [
        'ts/scripts/themeTokensGen.ts',
        // source collection of variables exported from Figma as *.json
        getCliArgStartWith('--tokens='),
        // folder where mixins will be generated
        getCliArgStartWith('--out='),
    ];
    spawn.sync('ts-node', args, { encoding: 'utf8', stdio: 'inherit' });
}

function getCliArgStartWith(prefix) {
    return [...process.argv].find((s) => s.indexOf(prefix) === 0) || '';
}
