import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, TUuiTsDoc, UUI3, UUI4,
} from '../common';

export class DatePickerDoc extends BaseDocsBlock {
    title = 'DatePicker';

    override getUuiTsDoc = (): TUuiTsDoc => ('@epam/uui:DatePickerProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/datePickers/datePicker.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/datePickers/datePicker.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="datePicker-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/datePicker/Basic.example.tsx" />

                <DocExample title="Format date" path="./_examples/datePicker/FormatDate.example.tsx" />

                <DocExample title="Render footer" path="./_examples/datePicker/Footer.example.tsx" />

                <DocExample title="Disable dates" path="./_examples/datePicker/Filter.example.tsx" />

                <DocExample title="Customize day render" path="./_examples/datePicker/CustomRenderDay.example.tsx" />
                {this.renderSectionTitle('Localization')}
                <EditableDocContent fileName="datePicker-localization" />
            </>
        );
    }
}
