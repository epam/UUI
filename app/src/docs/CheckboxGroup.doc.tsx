import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, TDocsGenType, UUI3, UUI4, UUI } from '../common';

export class CheckboxGroupDoc extends BaseDocsBlock {
    title = 'CheckboxGroup';

    override getDocsGenType = (): TDocsGenType => ('@epam/uui-components:CheckboxGroupProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/layout/checkboxGroup.props.ts',
            [UUI4]: './app/src/docs/_props/epam-promo/components/layout/checkboxGroup.props.ts',
            [UUI]: './app/src/docs/_props/uui/components/layout/checkboxGroup.props.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="checkboxGroup-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Checkbox Group" path="./_examples/checkbox/Group.example.tsx" />
            </>
        );
    }
}
