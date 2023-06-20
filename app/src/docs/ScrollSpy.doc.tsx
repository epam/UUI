import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class ScrollSpyDoc extends BaseDocsBlock {
    title = 'Scroll Spy';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="scrollSpy-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Scroll Spy Basic Usage" path="./_examples/scrollSpy/BasicScrollSpy.example.tsx" />
            </>
        );
    }
}
