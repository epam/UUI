import * as React from 'react';
import { EditableDocContent, BaseDocsBlock } from '../common';

export class CoreConceptsDoc extends BaseDocsBlock {
    title = 'Core Concepts';
    renderContent() {
        return (
            <EditableDocContent fileName="coreConcepts" />
        );
    }
}
