import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4, UUI } from '../common';

export class CheckboxDoc extends BaseDocsBlock {
    title = 'Checkbox';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/inputs/checkbox.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/inputs/checkbox.props.ts',
            [UUI]: './app/src/docs/_props/uui/components/inputs/checkbox.props.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="checkbox-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/checkbox/Basic.example.tsx" />
                <DocExample title="Checkbox Group" path="./_examples/checkbox/Group.example.tsx" />
            </>
        );
    }
}
