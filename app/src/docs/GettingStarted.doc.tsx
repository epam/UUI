import * as React from 'react';
import { EditableDocContent, BaseDocsBlock } from '../common';

export class GettingStartedDoc extends BaseDocsBlock {
    title = 'Getting started';

    renderContent() {
        return (
            <EditableDocContent fileName="overview" />
        );
    }
}
