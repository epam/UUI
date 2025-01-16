import React from 'react';
import { BaseDocsBlock, EditableDocContent } from '../../common';
import { TokenGroups } from './implementation/TokenGroups';

export class VariablesDoc extends BaseDocsBlock {
    title = 'Theme variables';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="Tokens-intro" />
                <TokenGroups />
            </>
        );
    }
}
