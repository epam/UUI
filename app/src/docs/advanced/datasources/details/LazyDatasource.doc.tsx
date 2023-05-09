import * as React from 'react';
import { BaseDocsBlock, EditableDocContent } from '../../../../common';

export class DatasourcesLazyDatasourceDoc extends BaseDocsBlock {
    title = 'LazyDatasource';

    renderContent() {
        return (
            <EditableDocContent fileName="datasources-lazy-datasource" />
        );
    }
}
