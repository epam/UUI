import * as React from 'react';
import { BaseDocsBlock, EditableDocContent } from '../../../../common';

export class DatasourcesArrayDatasourceDoc extends BaseDocsBlock {
    title = 'ArrayDatasource';

    renderContent() {
        return (
            <EditableDocContent fileName="datasources-Array-datasource" />
        );
    }
}
