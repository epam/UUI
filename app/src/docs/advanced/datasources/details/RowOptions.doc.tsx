import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../../../common';

export class DatasourcesRowOptionsDoc extends BaseDocsBlock {
    title = 'Row Options';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="datasources-row-options" />
                <DocExample title="Checkbox" path="./_examples/datasources/RowOptionsCheckbox.example.tsx" />
            </>
        );
    }
}
