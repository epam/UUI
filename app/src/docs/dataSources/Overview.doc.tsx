import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../common';

export class DataSourcesOverviewDoc extends BaseDocsBlock {
    title = 'Overview';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="dataSources-overview" />
                
                <DocExample title="useView" path="./_examples/dataSources/UseView.code.example.ts" onlyCode={ true } />
            </>
        );
    }
}
