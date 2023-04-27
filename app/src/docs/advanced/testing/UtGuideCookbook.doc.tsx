import * as React from 'react';
import { BaseDocsBlock, EditableDocContent } from '../../../common';

export class UtGuideCookbookDoc extends BaseDocsBlock {
    title = 'Cookbook';

    renderContent() {
        return (
            <EditableDocContent fileName="unitTestingGuide-3-cookbook" />
        );
    }
}
