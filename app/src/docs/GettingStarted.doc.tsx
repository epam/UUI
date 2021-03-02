import * as React from 'react';
import { EditableDocContent, BaseDocsBlock } from '../common';

export class GettingStartedDoc extends BaseDocsBlock {
    title = 'Getting Started';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='gettingStarted-intro' />
                { this.renderSectionTitle('Configuring from scratch') }
                <EditableDocContent fileName='gettingStarted-configuring from scratch' />
            </>
        );
    }
}