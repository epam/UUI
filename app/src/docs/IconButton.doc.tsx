import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI4, UUI3 } from '../common';

export class IconButtonDoc extends BaseDocsBlock {
    title = 'Icon Button';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/buttons/iconButton.props.ts',
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
