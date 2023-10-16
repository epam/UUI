import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, UUI4, UUI3, TDocsGenType,
} from '../common';

export class IconButtonDoc extends BaseDocsBlock {
    title = 'Icon Button';

    override getDocsGenType = (): TDocsGenType => ('@epam/uui:IconButtonProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/buttons/iconButton.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/buttons/iconButton.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="icon-button-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/iconButton/Basic.example.tsx" />
            </>
        );
    }
}
