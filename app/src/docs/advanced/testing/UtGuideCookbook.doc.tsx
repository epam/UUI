import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../../common';

export class UtGuideCookbookDoc extends BaseDocsBlock {
    title = 'Cookbook';

    renderContent() {
        return (
            <>
                <DocExample title="Quick start" path="./_examples/testing/__tests__/testComponent.test.tsx" onlyCode={ true } />
                <EditableDocContent fileName="unitTestingGuide-2-cookbook" />
            </>

        );
    }
}
