import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI4, UUI3 } from '../common/docs';

export class FlexCellDoc extends BaseDocsBlock {
    title = 'FlexCell';

    getPropsDocPath() {
        return {
            [UUI4]: './app/src/docs/_props/epam-promo/components/layout/FlexItems/flexCell.props.tsx',
            [UUI3]: './app/src/docs/_props/loveship/components/layout/FlexItems/flexCell.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='flexCell-description' />

                { this.renderSectionTitle('Examples') }
                <DocExample
                    path='./_examples/flexItems/FlexCell.example.tsx'
                />
            </>
        );
    }
}
