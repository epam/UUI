import path from 'path';
// @ts-ignore
import { uuiRoot } from '../utils/constants';
import { SyntaxKind } from 'ts-morph';

const DIR_REL = 'public/docs/docsGenOutput';
export const OUTPUT_FILE_FULL_PATH = path.resolve(uuiRoot, `${DIR_REL}/docsGenOutput.json`);
export const OUTPUT_DTS_FILE_FULL_PATH = path.resolve(uuiRoot, `${DIR_REL}/docsGenOutput.d.ts`);
export const OUTPUT_STATS_FILE_FULL_PATH = path.resolve(uuiRoot, `${DIR_REL}/docsGenStats.json`);
export const TSCONFIG_PATH = './tsconfig.json';
export const INDEX_PATH = './index.tsx';

export const SYNTAX_KIND_NAMES = Object.keys(SyntaxKind).reduce<Record<number, string>>((acc, name) => {
    acc[SyntaxKind[name as any] as any] = name;
    return acc;
}, {});

function fullPath(relative: string) {
    return path.resolve(uuiRoot, relative);
}

export function getUuiModuleNameFromPath(absolutePath: string) {
    const rel = path.relative(uuiRoot, absolutePath);
    const moduleFolderName = rel.split(path.sep)[0];
    const foundEntry = Object.entries(INCLUDED_UUI_PACKAGES).find((e) => {
        const folderName = path.relative(uuiRoot, e[1]);
        return folderName === moduleFolderName;
    });
    if (foundEntry) {
        return foundEntry[0];
    }
}

export const INCLUDED_UUI_PACKAGES: Record<string, string> = {
    '@epam/uui-core': fullPath('./uui-core'),
    '@epam/uui-components': fullPath('./uui-components'),
    '@epam/uui': fullPath('./uui'),
    '@epam/promo': fullPath('./epam-promo'),
    '@epam/loveship': fullPath('./loveship'),
    '@epam/uui-editor': fullPath('./uui-editor'),
    '@epam/uui-timeline': fullPath('./uui-timeline'),
};

export const INCLUDED_EXPORT_KINDS = [
    SyntaxKind.TypeAliasDeclaration,
    SyntaxKind.InterfaceDeclaration,
];
