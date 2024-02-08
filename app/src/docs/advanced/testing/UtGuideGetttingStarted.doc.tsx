import * as React from 'react';
import { BaseDocsBlock, EditableDocContent } from '../../../common';

export class UtGuideGettingStartedDoc extends BaseDocsBlock {
    title = 'Getting Started';

    renderContent() {
        return (
            <EditableDocContent fileName="unitTestingGuide-getting-started" />
        );
    }
}
