import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from "../common";

export class ScrollSpyDoc extends BaseDocsBlock {
    title = 'Scroll Spy';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='scrollSpy-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Scroll Spy Usage within a form'
                    path='./examples/scrollSpy/ScrollSpyForm.example.tsx'
                />
            </>
        );
    }
}