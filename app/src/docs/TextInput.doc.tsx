import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4, UUI, TUuiTsDoc,
} from '../common';

export class TextInputDoc extends BaseDocsBlock {
    title = 'Text Input';

    override getUuiTsDoc = (): TUuiTsDoc => ('@epam/uui:TextInputProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/inputs/textInput.props.ts',
            [UUI4]: './app/src/docs/_props/epam-promo/components/inputs/textInput.props.ts',
            [UUI]: './app/src/docs/_props/uui/components/inputs/textInput.props.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="textInput-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/textInput/Basic.example.tsx" />
                <DocExample title="Size" path="./_examples/textInput/Size.example.tsx" />
                <DocExample title="Action" path="./_examples/textInput/Action.example.tsx" />
            </>
        );
    }
}
