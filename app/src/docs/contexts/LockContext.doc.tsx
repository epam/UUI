import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../../common';

export class LockContextDoc extends BaseDocsBlock {
    title = 'Lock context';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='lock-context-descriptions' />
            </>
        );
    }
}
