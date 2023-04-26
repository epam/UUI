import * as React from 'react';
import { EditableDocContent, BaseDocsBlock } from '../../../common';

export class ValidationDoc extends BaseDocsBlock {
    title = 'Validation';
    renderContent() {
        return (
            <EditableDocContent key="validation-for-designers" fileName="validation-for-designers" />
        );
    }
}
