import React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { TTypeRef } from '../../../apiReference/sharedTypes';
import { TDocsGenExportedType } from '../../../apiReference/types';
import { TPropDocBuilder } from '../types';

const TEMPLATE_DOC = new DocBuilder<Record<TTypeRef | TDocsGenExportedType, any>>({ name: '' })
    .prop('@epam/uui-core:ClassValue', {
        renderEditor: 'CssClassEditor',
        examples: [],
    })
    .prop('@types/react:ReactNode', {
        examples: [
            { name: 'ReactNode-1', value: (<div>ReactNode-1</div>) },
            { name: 'ReactNode-2', value: (<div>ReactNode-2</div>) },
        ],
    });

const byAliasRefMap = (ref: TTypeRef) => {
    const found = TEMPLATE_DOC.props.find((p) => p.name === ref);
    if (found) {
        const { name, ...details } = found;
        return details;
    }
};

export const buildByAlias: TPropDocBuilder = (params) => {
    const { prop } = params;
    const byAlias = byAliasRefMap(prop.typeValueRef);
    if (byAlias) {
        return byAlias;
    }
};
