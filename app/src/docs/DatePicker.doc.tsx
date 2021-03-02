import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4 } from '../common';

export class DatePickerDoc extends BaseDocsBlock {
    title = 'DatePicker';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/datePickers/docs/datePicker.doc.tsx',
            [UUI4]: './epam-promo/components/datePickers/docs/datePicker.doc.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='datePicker-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/datePicker/Basic.example.tsx'
                />

                <DocExample
                    title='Format date & render footer'
                    path='./examples/datePicker/FormatDate.example.tsx'
                />

                <DocExample
                    title='Disable dates'
                    path='./examples/datePicker/Filter.example.tsx'
                />

                <DocExample
                    title='Customize day render'
                    path='./examples/datePicker/CustomRenderDay.example.tsx'
                />
                { this.renderSectionTitle('Localization') }
                <EditableDocContent fileName='datePicker-localization' />
            </>
        );
    }
}