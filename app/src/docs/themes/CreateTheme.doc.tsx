import * as React from 'react';
import { EditableDocContent, BaseDocsBlock } from '../../common';

export class CreateThemeDoc extends BaseDocsBlock {
    title = 'Create your own theme';

    renderContent() {
        return (
            <EditableDocContent fileName="create-theme" />
        );
    }
}
