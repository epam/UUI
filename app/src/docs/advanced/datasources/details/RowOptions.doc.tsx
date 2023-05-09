import * as React from 'react';
import { BaseDocsBlock, EditableDocContent } from '../../../../common';

export class DatasourcesRowOptionsDoc extends BaseDocsBlock {
    title = 'Row Options';

    renderContent() {
        return (
            <EditableDocContent fileName="datasources-row-options" />
        );
    }
}
