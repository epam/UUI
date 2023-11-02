import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, UUI4, UUI3, UUI, TDocsGenType,
} from '../common';

export class PanelDoc extends BaseDocsBlock {
    title = 'Panel';

    override getDocsGenType = (): TDocsGenType => ('@epam/uui:PanelProps');

    getPropsDocPath() {
        return {
            [UUI4]: './app/src/docs/_props/epam-promo/components/layout/FlexItems/panel.props.tsx',
            [UUI3]: './app/src/docs/_props/loveship/components/layout/FlexItems/panel.props.tsx',
            [UUI]: './app/src/docs/_props/uui/components/layout/FlexItems/panel.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="panel-description" />

                {this.renderSectionTitle('Examples')}
                <DocExample path="./_examples/flexItems/Panel.example.tsx" />
            </>
        );
    }
}
