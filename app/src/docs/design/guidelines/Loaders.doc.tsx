import * as React from 'react';
import { EditableDocContent, BaseDocsBlock } from '../../../common';

export class LoadersDoc extends BaseDocsBlock {
    title = 'Loaders';
    renderContent() {
        return (
            <EditableDocContent key="loaders-for-designers" fileName="loaders-for-designers" />
        );
    }
}
