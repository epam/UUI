import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4 } from '../common';

export class ProgressBarDoc extends BaseDocsBlock {
    title = 'Loaders';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='progressBar-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic ProgressBar'
                    path='./examples/progressBar/Basic.example.tsx'
                />
                <DocExample
                    title='ProgressBar with custom label'
                    path='./examples/progressBar/CustomLabel.example.tsx'
                />
                <DocExample
                    title='IndeterminateBar example'
                    path='./examples/progressBar/IndeterminateBar.example.tsx'
                />
                <DocExample
                    title='IndicatorBar example'
                    path='./examples/progressBar/IndicatorBar.example.tsx'
                />
            </>
        );
    }
}