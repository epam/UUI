const { getCliArgValue, hasCliArg } = require("../../utils/cmdUtils");

function main() {
    const spawn = require("cross-spawn");
    const args = [
        '-c', require.resolve('./rollup.config.js'),
    ];
    if (hasCliArg("--watch")) {
        args.push('--watch')
    }

    const rootRelativePathArgName = "--configMonorepoRootRelative";
    const rootRelativePathArgValue = getCliArgValue(rootRelativePathArgName);
    if (rootRelativePathArgValue) {
        args.push(rootRelativePathArgName, rootRelativePathArgValue)
    }
    spawn.sync("rollup", args, { encoding: "utf8", stdio: "inherit" });
}

module.exports = {
    main,
}
