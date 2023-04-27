import * as React from 'react';
import { EditableDocContent, BaseDocsBlock } from '../../../common';

export class EmptyStatesDoc extends BaseDocsBlock {
    title = 'Empty States';
    renderContent() {
        return (
            <EditableDocContent key="emptyStates-for-designers" fileName="emptyStates-for-designers" />
        );
    }
}
