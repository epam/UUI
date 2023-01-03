import * as React from 'react';
import {BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4} from '../common';

export class TimePickerDoc extends BaseDocsBlock {
    title = 'TimePicker';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docProps/loveship/components/inputs/timePicker.doc.ts',
            [UUI4]: './app/src/docProps/epam-promo/components/inputs/timePicker.doc.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='timePicker-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/timePicker/Basic.example.tsx'
                />

                <DocExample
                    title=' 24 time format'
                    path='./examples/timePicker/TimeFormat.example.tsx'
                />
            </>
        );
    }
}
