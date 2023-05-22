import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../../common';

export class DatasourcesOverviewDoc extends BaseDocsBlock {
    title = 'Overview';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="datasources-overview" />
                
                <DocExample title="useView" path="./_examples/datasources/UseView.code.example.ts" onlyCode={ true } />
            </>
        );
    }
}
