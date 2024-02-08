import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../../common';

export class UtGuideCookbookDoc extends BaseDocsBlock {
    title = 'Cookbook';

    renderContent() {
        return (
            <>
                <DocExample title="Quick start (without setupComponentForTest)" path="./_examples/testing/__tests__/testComponentSimpleContext.test.tsx" onlyCode={ true } />
                <DocExample title="Quick start (without @epam/test-utils)" path="./_examples/testing/__tests__/testComponentNoTestUtils.test.tsx" onlyCode={ true } />
                <EditableDocContent fileName="unitTestingGuide-cookbook" />
            </>

        );
    }
}
