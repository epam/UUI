import { readdir, writeFile, realpath, readFile } from 'fs/promises';
import { EOL } from 'os';
import { ParsedPath, resolve, parse } from 'path';
import { transformHandler } from './transformHandlers';
import { CoreTokens, PaletteToken, ThemesObject, TokenObject, TokensObject, UuiComponent } from './types';
import { checkTokens } from './checkTokens';
import { defaultTokens } from './defaults';
import defaultsDeep from 'lodash.defaultsdeep';
import { getAllMonorepoPackages } from './../utils/monorepoUtils';

const ignoreDirList = ['public', 'build', 'node_modules'];

export const transformTokensFromJsonToCss = async function () {
    async function getFilesWithTokens(dir: string): Promise<string[]> {
        const dirents = await readdir(dir, { withFileTypes: true });
        const files = [];
        for await (const dirent of dirents) {
            const res = resolve(dir, dirent.name);
            if (dirent.isDirectory()) {
                !ignoreDirList.includes(dirent.name) && files.push(...(await getFilesWithTokens(res)));
            } else {
                const pathBase = parse(res).base;
                files.push(pathBase.includes('tokens.json') ? res : undefined);
            }
        }

        return files.filter((v) => v !== undefined);
    }

    async function writeCssFile(file: string, data: string) {
        await writeFile(file, data);
    }

    function createCssVariables(palletObj: UuiComponent | PaletteToken | CoreTokens | TokenObject) {
        const vars: string[] = [];
        Object.entries(palletObj).forEach(([key, value]) => {
            if ((!value.type && Array.isArray(value)) || typeof value === 'string') return;

            if ('type' in value) {
                vars.push(`\t--${key}: ${transformHandler[value.type as keyof typeof transformHandler](value.value as any)};${EOL}`);
            } else {
                vars.push(...createCssVariables(value));
            }
        });
        return vars;
    }

    function createCssClasses(classObj: UuiComponent) {
        const classes: string[] = [];
        Object.entries(classObj).forEach(([key, value]) => {
            classes.push(`.${key} {${EOL}`);
            classes.push(...createCoreTokens(value));
            classes.push(`}${EOL}`);
        });
        return classes;
    }

    function createCoreTokens(coreObj: CoreTokens) {
        const tokens: string[] = [];
        Object.entries(coreObj).forEach(([key, token]) => {
            if ('type' in token) {
                tokens.push(`\t--${key}: ${transformHandler[token.type as keyof typeof transformHandler](token.value as any)};${EOL}`);
            } else {
                tokens.push(...createCssVariables(token));
            }
        });

        return tokens;
    }

    function createThemeCssFile(file: string, themeName: string, themeObj: TokensObject) {
        const { palette, core, ...components } = themeObj;

        let data = `.uui-theme-${themeName} {${EOL}`;
        createCssVariables(palette).forEach((value) => (data += value));
        createCoreTokens(core).forEach((value) => (data += value));
        data += `}${EOL}`;

        Object.values(components).forEach((value) => {
            createCssClasses(value as UuiComponent).forEach((value) => {
                data += value;
            });
        });

        writeCssFile(file, data);
    }

    function transformTokensToCssFiles(pathObj: ParsedPath, obj: ThemesObject) {
        const { default: defaultTheme, ...restThemes } = obj;

        const checkedTheme = checkTokens(defaultTheme, defaultTokens, 'default');
        const defaultThemeFile = resolve(pathObj.dir, 'default-theme.css');

        createThemeCssFile(defaultThemeFile, 'default', checkedTheme);

        Object.entries(restThemes).forEach(([key, value]) => {
            const themeFile = resolve(pathObj.dir, `${key}-theme.css`);
            const mergedTheme = defaultsDeep(value, defaultTheme);

            const checkedTheme = checkTokens(mergedTheme, defaultTokens, key);

            createThemeCssFile(themeFile, key, checkedTheme);
        });
    }

    const appRootDir = getAllMonorepoPackages()['@epam/app'].moduleRootDir;
    const tokensFiles = await getFilesWithTokens(appRootDir);

    tokensFiles.map(async (filePath) => {
        const pathObj: ParsedPath = parse(filePath);
        const obj: ThemesObject = JSON.parse(await readFile(filePath, 'utf8'));
        transformTokensToCssFiles(pathObj, obj);
    });
};
