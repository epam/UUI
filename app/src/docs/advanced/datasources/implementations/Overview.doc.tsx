import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../../../common';

export class DatasourcesOverviewDoc extends BaseDocsBlock {
    title = 'Overview';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="datasources-overview" />
                <DocExample title="BaseDatasourceProps" path="./_examples/datasources/BaseDatasourceProps.code.example.ts" onlyCode={ true } />
                <EditableDocContent fileName="datasources-base-props-overview" />
            </>
        );
    }
}
