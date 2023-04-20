import { ComponentClass, TokensObject } from './types';
import defaultsDeep from 'lodash.defaultsdeep';
import { uppercaseFirst } from './helpers';

const checkCoreTokens = (core: TokensObject['core'], coreScheme: TokensObject['core'], themeName: string) => {
    Object.keys(coreScheme).forEach((key) => {
        try {
            if (!core[key] || !core[key].value) {
                throw Error(`The ${key} token is not set, set the token and repeat the transformation again`);
            }
        } catch (e) {
            console.log('\x1b[41m', `[${themeName.toUpperCase()} THEME][Core] ` + 'Warning: ' + `${e.message}`, '\x1b[0m');
        }
    });

    Object.keys(core).forEach((key) => {
        try {
            if (!coreScheme[key] || !coreScheme[key].value) {
                throw Error(`New token --${key} has been added to core`);
            }
        } catch (e) {
            console.log('\x1b[43m', `[${themeName.toUpperCase()} THEME][Core] ` + 'Warning: ' + `${e.message}`, '\x1b[0m');
        }
    });

    return defaultsDeep(core, coreScheme);
};

const checkComponents = (componentTokens: Omit<TokensObject, 'core' | 'palette'>, componentsScheme: Omit<TokensObject, 'core' | 'pallet'>, themeName: string) => {
    Object.keys(componentTokens).forEach((key) => {
        try {
            if (!componentsScheme[key]) {
                throw Error(`New component - "${uppercaseFirst(key)}" has been added, check if the required tokens are available in the core`);
            }
        } catch (e) {
            console.log('\x1b[43m', `[${themeName.toUpperCase()} THEME] ` + 'Warning: ' + `${e.message}`, '\x1b[0m');
        }
    });

    Object.entries(componentsScheme).forEach(([componentKey, componentClass]) => {
        componentTokens[componentKey]
            && Object.entries(componentTokens[componentKey]).forEach(([key, tokens]) => {
                try {
                    if (!componentsScheme[componentKey][key]) {
                        throw Error(`New class .${key} has been added to "${uppercaseFirst(componentKey)}", check if the required tokens are available in the core`);
                    } else {
                        tokens
                            && Object.entries(tokens).forEach(([token, value]) => {
                                try {
                                    if (!(componentsScheme[componentKey][key] as ComponentClass)[token]) {
                                        throw Error(`New token --${token} has been added to .${key}, check if the required tokens are available in the core`);
                                    }
                                } catch (e) {
                                    console.log('\x1b[43m', `[${themeName.toUpperCase()} THEME] ` + 'Warning: ' + `${e.message}`, '\x1b[0m');
                                }
                            });
                    }
                } catch (e) {
                    console.log('\x1b[43m', `[${themeName.toUpperCase()} THEME] ` + 'Warning: ' + `${e.message}`, '\x1b[0m');
                }
            });
    });
};

const checkComponentTokens = (componentTokens: Omit<TokensObject, 'core' | 'palette'>, componentsScheme: Omit<TokensObject, 'core' | 'pallet'>, themeName: string) => {
    checkComponents(componentTokens, componentsScheme, themeName);

    return defaultsDeep(componentTokens, componentsScheme);
};

export const checkTokens = (tokenObj: TokensObject, defaultTokens: TokensObject, themeName: string) => {
    const { palette, core, ...componentTokens } = tokenObj;
    const { palette: paletteDefault, core: coreScheme, ...componentDefaults } = defaultTokens;

    const coreResult = checkCoreTokens(core, coreScheme as TokensObject['core'], themeName);
    const componentTokensResult = checkComponentTokens(componentTokens, componentDefaults, themeName);

    return { palette: palette, core: coreResult, ...componentTokensResult };
};
