import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, TDocsGenType, UUI3, UUI4, UUI } from '../common';

export class RadioGroupDoc extends BaseDocsBlock {
    title = 'RadioGroup';

    override getDocsGenType = (): TDocsGenType => ('@epam/uui-components:RadioGroupProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/layout/radioGroup.props.ts',
            [UUI4]: './app/src/docs/_props/epam-promo/components/layout/radioGroup.props.ts',
            [UUI]: './app/src/docs/_props/uui/components/layout/radioGroup.props.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="radioGroup-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="RadioInput Group" path="./_examples/radioInput/Group.example.tsx" />
            </>
        );
    }
}
