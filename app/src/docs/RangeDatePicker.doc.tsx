import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4,
} from '../common';

export class RangeDatePickerDoc extends BaseDocsBlock {
    title = 'RangeDatePicker';
    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/datePickers/rangeDatePicker.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/datePickers/rangeDatePicker.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="rangeDatePicker-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/rangeDatePicker/Basic.example.tsx" />

                <DocExample title="Presets and Footer" path="./_examples/rangeDatePicker/PresetsAndFooter.example.tsx" />

                {this.renderSectionTitle('Localization')}
                <EditableDocContent fileName="datePicker-localization" />
            </>
        );
    }
}
