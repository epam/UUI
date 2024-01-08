import path from 'path';

import { SyntaxKind } from 'ts-morph';
import { uuiRoot } from '../../constants';

const OUT_DIR_REL = 'public/docs/docsGenOutput';
export const OUTPUT_FILE_FULL_PATH = path.resolve(uuiRoot, `${OUT_DIR_REL}/docsGenOutput.json`);
export const OUTPUT_DTS_FILE_FULL_PATH = path.resolve(uuiRoot, `${OUT_DIR_REL}/docsGenOutput.d.ts`);
export const OUTPUT_STATS_FILE_FULL_PATH = path.resolve(uuiRoot, `${OUT_DIR_REL}/docsGenStats.json`);
export const TSCONFIG_PATH = './tsconfig.json';
export const INDEX_PATH = './index.tsx';

export const SYNTAX_KIND_NAMES = Object.keys(SyntaxKind).reduce<Record<number, string>>((acc, name) => {
    acc[SyntaxKind[name as any] as any] = name;
    return acc;
}, {});

export const INCLUDED_PACKAGES: Record<string, string> = {
    '@epam/uui-core': 'uui-core',
    '@epam/uui-components': 'uui-components',
    '@epam/uui': 'uui',
    '@epam/promo': 'epam-promo',
    '@epam/electric': 'epam-electric',
    '@epam/loveship': 'loveship',
    '@epam/uui-editor': 'uui-editor',
};

export const INCLUDED_EXPORT_KINDS = [
    SyntaxKind.TypeAliasDeclaration,
    SyntaxKind.InterfaceDeclaration,
];
