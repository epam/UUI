import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../common';

export class DataSourcesRowOptionsDoc extends BaseDocsBlock {
    title = 'Row Options';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="dataSources-row-options" />
                
                <EditableDocContent title="DataRowOptions" fileName="dataSources-row-options-overview" />

                <DocExample title="Checkbox" path="./_examples/dataSources/RowOptionsCheckbox.example.tsx" />
                <DocExample title="Disabled rows" path="./_examples/dataSources/RowOptionsIsDisabled.example.tsx" />
                <DocExample title="Selectable rows" path="./_examples/dataSources/RowOptionsIsSelectable.example.tsx" />
                <DocExample title="Click handler" path="./_examples/dataSources/RowOptionsOnClick.example.tsx" />
                <DocExample title="Links" path="./_examples/dataSources/RowOptionsLink.example.tsx" />
                <DocExample title="Drag'n'drop" path="./_examples/dataSources/RowOptionsDnd.example.tsx" />
                <DocExample title="Value/onValueChange" path="./_examples/dataSources/RowOptionsValue.example.tsx" />
                <DocExample title="Readonly" path="./_examples/dataSources/RowOptionsIsReadonly.example.tsx" />
                <DocExample title="Invalid" path="./_examples/dataSources/RowOptionsIsInvalid.example.tsx" />
            </>
        );
    }
}
