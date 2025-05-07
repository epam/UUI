import * as React from 'react';
import { EditableDocContent, BaseDocsBlock } from '../common';

export class SupportDoc extends BaseDocsBlock {
    title = 'Support';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="Support" />
            </>
        );
    }
}
