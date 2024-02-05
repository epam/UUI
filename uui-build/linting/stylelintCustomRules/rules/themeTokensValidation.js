const postcss = require('postcss');
const fs = require('fs');
const postcssSass = require('@csstools/postcss-sass');
const scssParser = require('postcss-scss');
const stylelint = require('stylelint');
const { RULE_NAMES } = require('../constants');

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = RULE_NAMES.THEME_TOKENS_VALIDATION;
const messages = ruleMessages(ruleName, {
    reportUnknownVar: (property) => `CSS variable is not declared: ${property}`,
    reportDoubleDeclarationOfCssProp: (property) => `This CSS property is declared more than once: ${property}`,
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

function isDeclInRootThemeSelectorScope(decl) {
    const selector = decl.parent.selector;
    return selector && selector.split(' ').length === 1 && selector.indexOf('.uui-theme-') === 0;
}

function isDeclInRootThemeMixinScope(decl) {
    const p = decl.parent;
    if (p && p.type === 'atrule' && p.name === 'mixin' && p.params.indexOf('theme-') === 0) {
        return true;
    }
}

function isIgnoredUnknownVar(params) {
    const { secondaryOptions, varToCheck } = params;
    const arr = secondaryOptions?.ignoredUnknownVars || [];
    return arr.indexOf(varToCheck) !== -1;
}

function isIgnoredRedeclaredVar(params) {
    const { secondaryOptions, varToCheck } = params;
    const arr = secondaryOptions?.ignoredRedeclaredVars || [];
    return arr.indexOf(varToCheck) !== -1;
}

const isString = (v) => typeof v === 'string';

async function getCustomPropsInfo(scssFullPath) {
    const compiled = await compileScss(scssFullPath);
    const declared = new Set();

    const declaredInRootThemeSelector = new Set();
    const declaredInRootThemeSelectorMoreThanOnce = new Set();

    const used = new Set();
    compiled.root.walkDecls((decl) => {
        const prop = decl.prop;
        if (prop.startsWith('--')) {
            if (isDeclInRootThemeSelectorScope(decl)) {
                if (declaredInRootThemeSelector.has(prop)) {
                    declaredInRootThemeSelectorMoreThanOnce.add(prop);
                }
                declaredInRootThemeSelector.add(prop);
            }
            declared.add(prop);
        }
        const res = Array.from(getReferencedCustomPropsFromDecl(decl));
        if (res?.length) {
            res.forEach((m) => used.add(m));
        }
    });
    const usedButNotDeclared = new Set();
    [...used].forEach((p) => {
        if (!declared.has(p)) {
            usedButNotDeclared.add(p);
        }
    });

    return { declared, used, usedButNotDeclared, declaredInRootThemeSelectorMoreThanOnce };
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
                    ignoredUnknownVars: [isString],
                    ignoredRedeclaredVars: [isString],
                },
                optional: true,
            },
        );
        if (!isRuleConfigValid) {
            return;
        }

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
                if (decl.prop.startsWith('--')) {
                    const isIgnored = isIgnoredRedeclaredVar({ secondaryOptions, varToCheck: decl.prop });
                    if (isIgnored) {
                        return;
                    }
                    if (info.declaredInRootThemeSelectorMoreThanOnce.has(decl.prop)) {
                        if (!isDeclInRootThemeMixinScope(decl)) {
                            // it's OK to redeclare anywhere but directly in root selector scope
                            return;
                        }
                        report({
                            message: messages.reportDoubleDeclarationOfCssProp(decl.prop),
                            node: decl,
                            word: decl.prop,
                            result,
                            ruleName,
                        });
                    }
                }

                const usedCustomProps = getReferencedCustomPropsFromDecl(decl);
                if (usedCustomProps.size) {
                    usedCustomProps.forEach((p) => {
                        const isIgnored = isIgnoredUnknownVar({ secondaryOptions, varToCheck: p });
                        if (isIgnored) {
                            return;
                        }

                        if (info.usedButNotDeclared.has(p)) {
                            report({
                                message: messages.reportUnknownVar(p),
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
