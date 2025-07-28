import React from 'react';
import { EditableDocContent } from '../../../common';
import { TokenGroups } from './implementation/TokenGroups';
import { DocItem } from '@epam/uui-docs';

export const ThemeVariablesDocItem: DocItem = {
    id: 'tokens',
    name: 'Variables',
    parentId: 'themes',
    renderContent: () => {
        return (
            <>
                <EditableDocContent fileName="Tokens-intro" />
                <TokenGroups />
            </>
        );
    },
    tags: ['colors', 'variables', 'tokens'],
};
