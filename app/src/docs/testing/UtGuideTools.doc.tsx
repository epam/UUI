import * as React from 'react';
import { BaseDocsBlock, EditableDocContent } from '../../common';

export class UtGuideToolsDoc extends BaseDocsBlock {
    title = 'Tools';

    renderContent() {
        return (
            <EditableDocContent fileName="unitTestingGuide-tools" />
        );
    }
}
