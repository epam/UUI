import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4,
} from '../common';

export class CheckboxGroupDoc extends BaseDocsBlock {
    title = 'CheckboxGroup';
    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/layout/checkboxGroup.props.ts',
            [UUI4]: './app/src/docs/_props/epam-promo/components/layout/checkboxGroup.props.ts',
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
