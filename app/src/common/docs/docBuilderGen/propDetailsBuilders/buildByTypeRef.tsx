import React from 'react';
import { TDocsGenExportedType } from '@epam/uui-docs';
import { TPropDocBuilder } from '../docBuilderGenTypes';

const BY_RAW_TYPE: Record<string | TDocsGenExportedType, TPropDocBuilder> = {
    '@epam/uui-core:ClassValue': () => {
        return {
            editorType: 'CssClassEditor',
            examples: [],
        };
    },
    '@types/react:ReactNode': () => {
        return {
            examples: [
                { name: 'ReactNode-1', value: (<div>ReactNode-1</div>) },
                { name: 'ReactNode-2', value: (<div>ReactNode-2</div>) },
            ],
        };
    },
};

/**
 * Resolve the prop editor based on the property's "typeValueRef" value.
 * See "public/docs/docsGenOutput/docsGenOutput.json" for details.
 */
export const buildByTypeRef: TPropDocBuilder = (params) => {
    const { prop } = params;
    const builder = BY_RAW_TYPE[prop.typeValueRef];
    if (builder) {
        return builder(params);
    }
};
