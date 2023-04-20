import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4, UUI,
} from '../common';

export class RadioInputDoc extends BaseDocsBlock {
    title = 'RadioInput';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/inputs/radioInput.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/inputs/radioInput.props.ts',
            [UUI]: './app/src/docs/_props/uui/components/inputs/radioInput.props.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="radioInput-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/radioInput/Basic.example.tsx" />
                <DocExample title="RadioInput Group" path="./_examples/radioInput/Group.example.tsx" />
            </>
        );
    }
}
