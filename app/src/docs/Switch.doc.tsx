import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4 } from '../common';

export class SwitchDoc extends BaseDocsBlock {
    title = 'Switch';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/inputs/docs/switch.doc.ts',
            [UUI4]: './epam-promo/components/inputs/docs/switch.doc.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='switch-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/switch/Basic.example.tsx'
                />
            </>
        );
    }
}