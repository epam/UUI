import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, TUuiTsDoc, UUI3, UUI4,
} from '../common';

export class AvatarDoc extends BaseDocsBlock {
    title = 'Avatar';

    override getUuiTsDoc = (): TUuiTsDoc => ('@epam/uui-components:AvatarProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/widgets/avatar.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/widgets/avatar.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="avatar-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/avatar/Basic.example.tsx" />
            </>
        );
    }
}
