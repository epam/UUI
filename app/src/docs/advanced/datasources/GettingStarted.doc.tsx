import * as React from 'react';
import { BaseDocsBlock, EditableDocContent } from '../../../common';

export class DatasourcesGettingStartedDoc extends BaseDocsBlock {
    title = 'Getting Started';

    renderContent() {
        return <EditableDocContent fileName="datasources-getting-started" />;
    }
}
