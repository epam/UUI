import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, TDocsGenType, UUI3, UUI4, UUI } from '../common';

export class ControlGroupDoc extends BaseDocsBlock {
    title = 'Control Group';

    override getDocsGenType = (): TDocsGenType => ('@epam/uui-components:ControlGroupProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/layout/controlGroup.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/layout/controlGroup.props.tsx',
            [UUI]: './app/src/docs/_props/uui/components/layout/controlGroup.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="controlGroup-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/controlGroup/Basic.example.tsx" />
                <DocExample title="Prefix" path="./_examples/controlGroup/Prefix.example.tsx" />
            </>
        );
    }
}
