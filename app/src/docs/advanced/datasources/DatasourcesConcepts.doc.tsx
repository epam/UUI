import * as React from 'react';
import { BaseDocsBlock, EditableDocContent } from '../../../common';

export class DatasourcesConceptsDoc extends BaseDocsBlock {
    title = 'Concepts';

    renderContent() {
        return (
            <EditableDocContent fileName="datasources-concepts" />
        );
    }
}
