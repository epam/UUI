import * as React from 'react';
import { EditableDocContent, BaseDocsBlock } from '../../../common';

export class LayoutsDoc extends BaseDocsBlock {
    title = 'Layouts';
    renderContent() {
        return (
            <EditableDocContent key="layouts-for-designers" fileName="layouts-for-designers" />
        );
    }
}
