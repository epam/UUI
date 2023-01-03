import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4 } from '../common';

export class AvatarStackDoc extends BaseDocsBlock {
    title = 'AvatarStack';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docProps/loveship/components/widgets/avatarStack.doc.tsx',
            [UUI4]: './app/src/docProps/epam-promo/components/widgets/avatarStack.doc.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='avatarStack-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/avatarStack/Basic.example.tsx'
                />
                <DocExample
                    title="With custom avatar"
                    path='./examples/avatarStack/RenderItem.example.tsx'
                />
            </>
        );
    }
}
