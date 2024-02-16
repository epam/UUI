import * as React from 'react';
import { EditableDocContent, BaseDocsBlock } from '../common';

export class AccessibilityDoc extends BaseDocsBlock {
    title = 'Accessibility';
    renderContent() {
        return (
            <EditableDocContent fileName="Accessibility" />
        );
    }
}
