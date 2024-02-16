import * as React from 'react';
import { EditableDocContent, BaseDocsBlock } from '../common';

export class GettingStartedDoc extends BaseDocsBlock {
    title = 'Getting Started';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="gettingStarted-intro" />
                {this.renderSectionTitle('Starting a new Vite project')}
                <EditableDocContent fileName="gettingStarted-configuring from scratch vite" />
                {this.renderSectionTitle('Starting a new CRA-based project')}
                <EditableDocContent fileName="gettingStarted-configuring from scratch" />
                {this.renderSectionTitle('Starting a new Next.js project')}
                <EditableDocContent fileName="gettingStarted-configuring from scratch nextjs" />
                {this.renderSectionTitle('Adding UUI to existing project')}
                <EditableDocContent fileName="Configuring-into-existing-project" />
            </>
        );
    }
}
