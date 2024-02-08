import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../../common';

export class UtGuideGettingStartedDoc extends BaseDocsBlock {
    title = 'Getting Started';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="unitTestingGuide-getting-started" />
                <DocExample title="Quick start" path="./_examples/testing/__tests__/testComponent.test.tsx" onlyCode={ true } />
            </>
        );
    }
}
