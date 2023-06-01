import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../../common';

export class DataSourcesUsageDoc extends BaseDocsBlock {
    title = 'Usage in components';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="dataSources-usage-in-components" />

                <DocExample title="DataSourceViewer" path="./_examples/dataSources/DataSourceViewer.tsx" onlyCode={ true } />
            </>
        );
    }
}
