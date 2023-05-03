import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, UUI4, UUI3,
} from '../common';

export class AdaptivePanelDoc extends BaseDocsBlock {
    title = 'Adaptive panel';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="adaptivePanel-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/adaptivePanel/Basic.example.tsx" />
            </>
        );
    }
}
