import * as React from 'react';
import {
    BaseDocsBlock, EditableDocContent, DocExample,
} from '../common/docs';

export class PickerModalDoc extends BaseDocsBlock {
    title = 'Picker Modal';

    renderContent(): React.ReactNode {
        return (
            <>
                <EditableDocContent fileName="pickerModal-descriptions" />
                { this.renderSectionTitle('Examples') }
                <DocExample title="Basic" path="./_examples/pickerModal/BasicPickerModal.example.tsx" />
                <DocExample title="Async tree with entity value type" path="./_examples/pickerModal/AsyncTreePickerModalWithEntity.example.tsx" />
                <DocExample title="LazyTree" path="./_examples/pickerModal/LazyTreePickerModal.example.tsx" />
            </>
        );
    }
}
