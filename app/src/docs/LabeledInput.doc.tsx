import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4, UUI, TDocsGenType,
} from '../common';

export class LabeledInputDoc extends BaseDocsBlock {
    title = 'Labeled Input';

    override getDocsGenType = (): TDocsGenType => ('@epam/uui:LabeledInputProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/layout/labeledInput.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/layout/labeledInput.props.tsx',
            [UUI]: './app/src/docs/_props/uui/components/layout/labeledInput.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="labeledInput-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/labeledInput/Basic.example.tsx" />
            </>
        );
    }
}
