import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4 } from '../common';

export class RadioGroupDoc extends BaseDocsBlock {
    title = 'RadioGroup';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/layout/radioGroup.props.ts',
            [UUI4]: './app/src/docs/_props/epam-promo/components/layout/radioGroup.props.ts',
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
