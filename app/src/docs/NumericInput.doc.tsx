import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4,
} from '../common';

export class NumericInputDoc extends BaseDocsBlock {
    title = 'NumericInput';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/inputs/numericInput.props.ts',
            [UUI4]: './app/src/docs/_props/epam-promo/components/inputs/numericInput.props.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="numericInput-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/numericInput/Basic.example.tsx" />
                <DocExample title="Formatting options" path="./_examples/numericInput/Formatting.example.tsx" />
                <DocExample title="Size" path="./_examples/numericInput/Size.example.tsx" />
            </>
        );
    }
}
