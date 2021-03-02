import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4 } from '../common';

export class MultiSwitchDoc extends BaseDocsBlock {
    title = 'MultiSwitch';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/inputs/docs/multiSwitch.doc.ts',
            [UUI4]: './epam-promo/components/inputs/docs/multiSwitch.doc.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='multiSwitch-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/multiSwitch/Basic.example.tsx'
                />
            </>
        );
    }
}