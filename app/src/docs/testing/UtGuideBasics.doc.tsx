import * as React from 'react';
import { BaseDocsBlock, EditableDocContent } from '../../common';

export class UtGuideBasicsDoc extends BaseDocsBlock {
    title = 'Basics';

    renderContent() {
        return (
            <EditableDocContent fileName="unitTestingGuide-basics" />
        );
    }
}
