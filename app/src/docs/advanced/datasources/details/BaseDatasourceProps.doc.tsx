import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../../../common';

export class DatasourcesBaseDatasourcePropsDoc extends BaseDocsBlock {
    title = 'Datasource Props';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="datasources-base-props" />
                <DocExample title="getId and getParentId" path="./_examples/datasources/DatasourcePropsIds.example.tsx" />
                <DocExample title="complexIds" path="./_examples/datasources/DatasourcePropsComplexIds.example.tsx" />
                <DocExample title="isFoldedByDefault" path="./_examples/datasources/DatasourcePropsIsFoldedByDefault.example.tsx" />
                <DocExample title="cascadeSelection" path="./_examples/datasources/DatasourcePropsCascadeSelection.example.tsx" />
                <DocExample title="selectAll" path="./_examples/datasources/DatasourcePropsSelectAll.example.tsx" />
            </>
        );
    }
}
