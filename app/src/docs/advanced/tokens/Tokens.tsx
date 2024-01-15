import React from 'react';
import { BaseDocsBlock, EditableDocContent } from '../../../common';
import { TokenGroups } from './TokenGroups';

export class Tokens extends BaseDocsBlock {
    title: string;

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="Tokens-intro" />
                <TokenGroups />
            </>
        );
    }
}
