import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../common';

export class AnalyticsContextDoc extends BaseDocsBlock {
    public readonly title = 'Analytics Context';
    public renderContent() {
        return (
            <>
                <EditableDocContent fileName="analytics-context-descriptions" />

                {this.renderSectionTitle('Getting started')}

                <DocExample path="./_examples/contexts/AnalyticsContextBase.example.tsx" onlyCode />

                {this.renderSectionTitle('Example')}

                <DocExample path="./_examples/contexts/AnalyticsContextEvents.example.tsx" onlyCode />
            </>
        );
    }
}
