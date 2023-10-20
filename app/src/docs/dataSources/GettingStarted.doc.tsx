import * as React from 'react';
import { BaseDocsBlock, EditableDocContent } from '../../common';

export class DataSourcesGettingStartedDoc extends BaseDocsBlock {
    title = 'Getting Started';

    renderContent() {
        return <EditableDocContent fileName="dataSources-getting-started" />;
    }
}
