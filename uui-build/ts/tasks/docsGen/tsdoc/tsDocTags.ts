import { DocBlock, Standardization, TSDocTagSyntaxKind } from '@microsoft/tsdoc';
import { extractTagValue, extractTagValueAsString, parseBlockTag } from './tsDocFormatters';

export const CORE_TAGS = {
    '@deprecated': {
        parser: (db: DocBlock) => {
            return parseBlockTag<string>(db, extractTagValueAsString);
        },
    },
};

export const CUSTOM_TAGS = {
    '@default': {
        tagDefinition: {
            tagName: '@default',
            syntaxKind: TSDocTagSyntaxKind.BlockTag,
            standardization: Standardization.Discretionary,
            allowMultiple: false,
            tagNameWithUpperCase: '@DEFAULT',
        },
        parser: (db: DocBlock) => {
            return parseBlockTag<boolean | string | number | null>(db, extractTagValue);
        },
    },
};
