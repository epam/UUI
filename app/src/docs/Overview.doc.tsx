import * as React from 'react';
import { EditableDocContent, BaseDocsBlock } from '../common';

export class OverviewDoc extends BaseDocsBlock {
    title = 'Overview';
    renderContent() {
        return (
            <EditableDocContent fileName="overview" />
        );
    }
}
