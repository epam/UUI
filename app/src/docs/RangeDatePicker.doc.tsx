import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4 } from '../common';

export class RangeDatePickerDoc extends BaseDocsBlock {
    title = 'RangeDatePicker';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/datePickers/docs/rangeDatePicker.doc.tsx',
            [UUI4]: './epam-promo/components/datePickers/docs/rangeDatePicker.doc.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='rangeDatePicker-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/rangeDatePicker/Basic.example.tsx'
                />

                <DocExample
                    title='Presets and Footer'
                    path='./examples/rangeDatePicker/PresetsAndFooter.example.tsx'
                />

                { this.renderSectionTitle('Localization') }
                <EditableDocContent fileName='datePicker-localization' />
            </>
        );
    }
}