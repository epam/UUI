import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../../../common';

export class DatasourcesDatasourceStateDoc extends BaseDocsBlock {
    title = 'Datasource State';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="datasources-datasource-state" />
                <DocExample title="Search" path="./_examples/datasources/DatasourceStateSearch.example.tsx" />
                <DocExample title="Checked" path="./_examples/datasources/DatasourceStateChecked.example.tsx" />
            </>
        );
    }
}
