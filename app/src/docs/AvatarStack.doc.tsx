import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, TDocsGenType, UUI3, UUI4, UUI } from '../common';

export class AvatarStackDoc extends BaseDocsBlock {
    title = 'AvatarStack';

    override getDocsGenType = (): TDocsGenType => ('@epam/uui-components:AvatarStackProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/widgets/avatarStack.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/widgets/avatarStack.props.tsx',
            [UUI]: './app/src/docs/_props/uui/components/widgets/avatarStack.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="avatarStack-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/avatarStack/Basic.example.tsx" />
                <DocExample title="With custom avatar" path="./_examples/avatarStack/RenderItem.example.tsx" />
            </>
        );
    }
}
