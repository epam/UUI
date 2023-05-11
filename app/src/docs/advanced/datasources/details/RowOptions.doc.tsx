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
                <DocExample title="Readonly" path="./_examples/datasources/RowOptionsIsReadonly.example.tsx" />
                <DocExample title="Required" path="./_examples/datasources/RowOptionsIsRequired.example.tsx" />
                <DocExample title="Invalid" path="./_examples/datasources/RowOptionsIsInvalid.example.tsx" />
                <DocExample title="Value/onValueChange" path="./_examples/datasources/RowOptionsValue.example.tsx" />
                <DocExample title="Drag'n'drop" path="./_examples/datasources/RowOptionsDnd.example.tsx" />
            </>
        );
    }
}
