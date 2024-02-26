import * as React from 'react';
import { EditableDocContent, BaseDocsBlock, DocExample } from '../common';

export class AccessibilityDoc extends BaseDocsBlock {
    title = 'Accessibility';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="Accessibility" />
                <DocExample title="Keyboard navigation" path="./_examples/accessibility/KeyboardNavigation.example.tsx" />
                <EditableDocContent title="Color contrast" fileName="color_contrast" />
                <DocExample title="Accessible labels" path="./_examples/accessibility/AccessibleLabels.example.tsx" />
            </>
        );
    }
}
