import * as React from 'react';
import { EditableDocContent, BaseDocsBlock, DocExample } from '../common';

export class LensesDoc extends BaseDocsBlock {
    title = 'Lenses';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="Lenses-overview" />
                <DocExample title="Basic usage" onlyCode={ true } path="./_examples/lenses/LensBasicGetSet.example.tsx" />
                <DocExample title="Spread lens value to form components" onlyCode={ true } path="./_examples/lenses/LensToProps.example.tsx" />
                <DocExample title="Work with arrays" onlyCode={ true } path="./_examples/lenses/LensWorkWithArrays.example.tsx" />
                <DocExample title="Provide your own setter" onlyCode={ true } path="./_examples/lenses/LensOnChange.example.tsx" />
                <DocExample title="Set default lens value" onlyCode={ true } path="./_examples/lenses/LensDefaultValue.example.tsx" />
            </>
        );
    }
}
