import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, UUI4, UUI3, TUuiTsDoc,
} from '../common';

export class IconContainerDoc extends BaseDocsBlock {
    title = 'Icon Container';

    override getUuiTsDoc = (): TUuiTsDoc => ('@epam/uui-components:ControlIconProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/layout/iconContainer.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/layout/iconContainer.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="iconContainer-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/iconContainer/Basic.example.tsx" />
            </>
        );
    }
}
