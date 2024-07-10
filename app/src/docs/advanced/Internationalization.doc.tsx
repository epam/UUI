import * as React from 'react';
import { EditableDocContent, BaseDocsBlock, DocExample } from '../../common';

export class InternationalizationDoc extends BaseDocsBlock {
    title = 'Internationalization';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="internationalization-intro" />
                <DocExample title="Right-to-left support(RTL)" path="./_examples/i18n/Rtl.example.tsx" />
            </>
        );
    }
}
