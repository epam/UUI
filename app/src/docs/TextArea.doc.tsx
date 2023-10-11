import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4, TDocsGenType,
} from '../common';

export class TextAreaDoc extends BaseDocsBlock {
    title = 'TextArea';

    override getDocsGenType = (): TDocsGenType => ('@epam/uui:TextAreaProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/inputs/textArea.props.ts',
            [UUI4]: './app/src/docs/_props/epam-promo/components/inputs/textArea.props.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="textArea-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/textArea/Basic.example.tsx" />
                <DocExample title="Advanced" path="./_examples/textArea/Advanced.example.tsx" />
            </>
        );
    }
}
