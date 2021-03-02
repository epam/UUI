import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4 } from '../common';

export class AvatarStackDoc extends BaseDocsBlock {
    title = 'AvatarStack';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/widgets/docs/avatarStack.doc.tsx',
            [UUI4]: './epam-promo/components/widgets/docs/avatarStack.doc.tsx',
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
            </>
        );
    }
}