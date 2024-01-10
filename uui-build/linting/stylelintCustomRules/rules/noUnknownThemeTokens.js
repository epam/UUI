const postcss = require('postcss');
const fs = require('fs');
const postcssSass = require('@csstools/postcss-sass');
const scssParser = require('postcss-scss');
const stylelint = require('stylelint');
const { RULE_NAMES } = require('../constants');

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = RULE_NAMES.NO_UNKNOWN_THEME_TOKENS;
const messages = ruleMessages(ruleName, {
    reportUnknown: (property) => `Unknown custom property: ${property}`,
    reportCantCompileScss: (fullPath, reason) => `Cannot compile ${fullPath}, Reason: ${reason}`,
});

async function compileScss(from) {
    const compiler = postcss([
        postcssSass({}),
    ]);
    let result;
    try {
        const src = fs.readFileSync(from, 'utf8');
        result = await compiler.process(src, { syntax: scssParser, from });
    } catch (err) {
        console.error(`Compile error ${from}`, err.stack);
        throw err;
    }
    return result;
}

function getReferencedCustomPropsFromDecl(decl) {
    const customPropUsageRegex = /var\((--[\w\d-]+)\)/g;
    const result = new Set();
    if (decl.type === 'decl') {
        const res = Array.from(decl.value.matchAll(customPropUsageRegex));
        if (res?.length) {
            res.forEach((m) => result.add(m[1]));
        }
    }
    return result;
}

const isString = (v) => typeof v === 'string';

async function getCustomPropsInfo(scssFullPath) {
    const compiled = await compileScss(scssFullPath);
    const declared = new Set();
    const used = new Set();
    compiled.root.walkDecls((decl) => {
        const prop = decl.prop;
        if (prop.startsWith('--')) {
            declared.add(prop);
        }
        const res = Array.from(getReferencedCustomPropsFromDecl(decl));
        if (res?.length) {
            res.forEach((m) => used.add(m));
        }
    });
    return { declared, used };
}

function rule(primaryOptions, secondaryOptions) {
    return async (root, result) => {
        const isRuleConfigValid = validateOptions(
            result,
            ruleName,
            { actual: primaryOptions },
            {
                actual: secondaryOptions,
                possible: {
                    ignored: [isString],
                },
                optional: true,
            },
        );
        if (!isRuleConfigValid) {
            return;
        }

        const arrOfIgnoredTokens = secondaryOptions?.ignored || [];

        const srcFullPath = result.opts.from;
        let info;
        try {
            info = await getCustomPropsInfo(srcFullPath);
        } catch (err) {
            report({
                message: messages.reportCantCompileScss(srcFullPath, err?.message),
                node: root,
                result,
                ruleName,
            });
        }

        if (info) {
            root.walkDecls((decl) => {
                const usedCustomProps = getReferencedCustomPropsFromDecl(decl);
                if (usedCustomProps.size) {
                    usedCustomProps.forEach((p) => {
                        if (!info.declared.has(p)) {
                            const isPropIgnored = arrOfIgnoredTokens.indexOf(p) !== -1;
                            if (isPropIgnored) {
                                return;
                            }
                            report({
                                message: messages.reportUnknown(p),
                                node: decl,
                                word: p,
                                result,
                                ruleName,
                            });
                        }
                    });
                }
            });
        }
    };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = {
    url: 'https://github.com/epam/UUI',
};

module.exports = rule;
