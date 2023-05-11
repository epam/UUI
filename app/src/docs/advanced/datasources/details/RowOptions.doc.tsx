import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../../../common';

export class DatasourcesRowOptionsDoc extends BaseDocsBlock {
    title = 'Row Options';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="datasources-row-options" />
                <DocExample title="Checkbox" path="./_examples/datasources/RowOptionsCheckbox.example.tsx" />
                <DocExample title="Disabled rows" path="./_examples/datasources/RowOptionsIsDisabled.example.tsx" />
                <DocExample title="Selectable rows" path="./_examples/datasources/RowOptionsIsSelectable.example.tsx" />
                <DocExample title="Click handler" path="./_examples/datasources/RowOptionsOnClick.example.tsx" />
                <DocExample title="Links" path="./_examples/datasources/RowOptionsLink.example.tsx" />
            </>
        );
    }
}
