import * as React from 'react';
import {
    BaseDocsBlock, EditableDocContent, DocExample, UUI,
} from '../common/docs';

export class PickerModalDoc extends BaseDocsBlock {
    title = 'Picker Modal';
    getPropsDocPath() {
        return {
            [UUI]: './app/src/docs/_props/uui/components/pickers/pickerModal.props.tsx',
        };
    }

    renderContent(): React.ReactNode {
        return (
            <>
                <EditableDocContent fileName="pickerModal-descriptions" />
                { this.renderSectionTitle('Examples') }
                <DocExample title="Basic" path="./_examples/pickerModal/BasicPickerModal.example.tsx" />
            </>
        );
    }
}
