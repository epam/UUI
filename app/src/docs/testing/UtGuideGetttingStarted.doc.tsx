import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../common';

export class UtGuideGettingStartedDoc extends BaseDocsBlock {
    title = 'Getting Started';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="unitTestingGuide-getting-started-add-dependencies" />
                <EditableDocContent fileName="unitTestingGuide-getting-started" />
                <DocExample title="Create Tests" path="./_examples/testing/__tests__/testComponent.test.tsx" onlyCode={ true } />
            </>
        );
    }
}
