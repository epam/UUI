/**
 * This module provides eslint rules which we want to pick from airbnb
 */
const { setUnifiedSeverityToConfig } = require('../utils/rulesSeverityUtils');

const baseMap = {
    ...require('eslint-config-airbnb-base/rules/errors').rules,
    ...require('eslint-config-airbnb-base/rules/imports').rules,
    ...require('eslint-config-airbnb-base/rules/best-practices').rules,
    ...require('eslint-config-airbnb-base/rules/variables').rules,
    ...require('eslint-config-airbnb-base/rules/es6').rules,
    ...require('eslint-config-airbnb-base/rules/style').rules,
};
const reactMap = {
    ...require('eslint-config-airbnb/rules/react').rules,
    ...require('eslint-config-airbnb/rules/react-a11y').rules,
};
const tsMap = { ...require('eslint-config-airbnb-typescript/lib/shared.js').rules };

const AIRBNB_PICK_RULES = {
    BASE: {
        STYLISTIC: [
            'array-bracket-spacing',
            'block-spacing',
            'brace-style',
            'comma-spacing',
            'comma-style',
            'computed-property-spacing',
            'curly',
            'eol-last',
            'function-call-argument-newline',
            'function-paren-newline',
            'generator-star-spacing',
            'import/newline-after-import',
            'indent',
            'key-spacing',
            'keyword-spacing',
            'max-len',
            'newline-per-chained-call',
            'no-mixed-spaces-and-tabs',
            'no-multiple-empty-lines',
            'no-multi-spaces',
            'nonblock-statement-body-position',
            'no-tabs',
            'no-whitespace-before-property',
            'object-curly-spacing',
            'operator-linebreak',
            'padded-blocks',
            'quote-props',
            'quotes',
            'semi',
            'semi-spacing',
            'space-before-blocks',
            'space-before-function-paren',
            'spaced-comment',
            'space-infix-ops',
            'space-in-parens',
            'template-curly-spacing',
            //
            'object-property-newline',
            'arrow-parens',
        ],
        NON_STYLISTIC: [
            'no-mixed-operators',
            'no-nested-ternary',
            'no-multi-assign',
            'func-names',
            //
            'no-return-assign',
            'block-scoped-var',
            'prefer-promise-reject-errors',
            //
            'no-unused-vars',
            //
            'no-var',
            'prefer-rest-params',
            //
            'no-promise-executor-return',
            //
            'import/export',
        ],
    },
    TS: {
        STYLISTIC: [
            '@typescript-eslint/brace-style',
            '@typescript-eslint/comma-spacing',
            '@typescript-eslint/indent',
            '@typescript-eslint/keyword-spacing',
            '@typescript-eslint/no-extra-semi',
            '@typescript-eslint/object-curly-spacing',
            '@typescript-eslint/quotes',
            '@typescript-eslint/semi',
            '@typescript-eslint/space-before-blocks',
            '@typescript-eslint/space-before-function-paren',
        ],
        NON_STYLISTIC: ['@typescript-eslint/no-unused-vars'],
    },
    REACT: {
        STYLISTIC: [
            'react/jsx-closing-bracket-location',
            'react/jsx-closing-tag-location',
            'react/jsx-curly-brace-presence',
            'react/jsx-curly-newline',
            'react/jsx-first-prop-new-line',
            'react/jsx-max-props-per-line',
            'react/jsx-one-expression-per-line',
            'react/jsx-props-no-multi-spaces',
            'react/jsx-tag-spacing',
            'jsx-quotes',
        ],
        NON_STYLISTIC: [
            'react/no-access-state-in-setstate',
            'react/jsx-no-bind',
            'react/prefer-stateless-function',
            'react/no-find-dom-node',
            //
            'jsx-a11y/no-noninteractive-tabindex',
            'jsx-a11y/no-noninteractive-element-interactions',
            'jsx-a11y/click-events-have-key-events',
            'jsx-a11y/iframe-has-title',
            'jsx-a11y/img-redundant-alt',
            'jsx-a11y/mouse-events-have-key-events',
            'jsx-a11y/no-static-element-interactions',
        ],
    },
};

const newConfig = {
    base: {
        stylistic: pickFromMap(baseMap, AIRBNB_PICK_RULES.BASE.STYLISTIC),
        nonStylistic: pickFromMap(baseMap, AIRBNB_PICK_RULES.BASE.NON_STYLISTIC),
    },
    react: {
        stylistic: pickFromMap(reactMap, AIRBNB_PICK_RULES.REACT.STYLISTIC),
        nonStylistic: pickFromMap(reactMap, AIRBNB_PICK_RULES.REACT.NON_STYLISTIC),
    },
    typescript: {
        stylistic: pickFromMap(tsMap, AIRBNB_PICK_RULES.TS.STYLISTIC, true),
        nonStylistic: pickFromMap(tsMap, AIRBNB_PICK_RULES.TS.NON_STYLISTIC, true),
    },
};
module.exports = newConfig;

function pickFromMap(map, names, isTypescript) {
    const rules = names.reduce((acc, ruleName) => {
        const fromMap = map[ruleName];
        if (fromMap) {
            if (isTypescript) {
                const nNotTs = ruleName.substring('@typescript-eslint/'.length);
                acc[nNotTs] = 'off'; // need to disable the corresponding js rule, to avoid conflict.
            }
            acc[ruleName] = fromMap;
        } else {
            throw new Error(`Unable to find "${ruleName}" in map.`);
        }
        return acc;
    }, {});
    return setUnifiedSeverityToConfig({ rules }).rules;
}
