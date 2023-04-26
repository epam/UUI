import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4, UUI,
} from '../common';

export class SpinnerDoc extends BaseDocsBlock {
    title = 'Spinner';
    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/widgets/spinner.props.ts',
            [UUI4]: './app/src/docs/_props/epam-promo/components/widgets/spinner.props.tsx',
            [UUI]: './app/src/docs/_props/uui/components/widgets/spinner.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="spinner-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/spinner/Basic.example.tsx" />
            </>
        );
    }
}
