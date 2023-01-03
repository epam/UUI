import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4 } from '../common';

export class MultiSwitchDoc extends BaseDocsBlock {
    title = 'MultiSwitch';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docProps/loveship/components/inputs/multiSwitch.doc.tsx',
            [UUI4]: './app/src/docProps/epam-promo/components/inputs/multiSwitch.doc.tsx',
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
