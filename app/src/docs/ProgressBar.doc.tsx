import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent,
} from '../common';

export class ProgressBarDoc extends BaseDocsBlock {
    title = 'Loaders';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="progressBar-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic ProgressBar" path="./_examples/progressBar/Basic.example.tsx" />
                <DocExample title="IndeterminateBar example" path="./_examples/progressBar/IndeterminateBar.example.tsx" />
                <DocExample title="IndicatorBar example" path="./_examples/progressBar/IndicatorBar.example.tsx" />
            </>
        );
    }
}
