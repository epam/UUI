import * as React from 'react';
import { EditableDocContent, BaseDocsBlock } from '../../common';

export class LockContextDoc extends BaseDocsBlock {
    title = 'Lock context';
    renderContent() {
        return (
            <EditableDocContent fileName="lock-context-descriptions" />
        );
    }
}
