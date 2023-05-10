import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../../../common';

export class DatasourcesBaseDatasourcePropsDoc extends BaseDocsBlock {
    title = 'Datasource Props';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="datasources-base-props" />
                <DocExample title="getId and getParentId" path="./_examples/datasources/DatasourcePropsIds.example.tsx" />
            </>
        );
    }
}
