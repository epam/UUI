import * as React from 'react';
import { EditableDocContent, BaseDocsBlock } from '../common';

export class InternationalizationDoc extends BaseDocsBlock {
    title = 'Internationalization';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='internationalization-intro' />
            </>
        );
    }
}
