import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../../common';

export class ContextProviderDoc extends BaseDocsBlock {
    title = 'UUI Context Provider';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="context-provider-descriptions" />
                <DocExample title="Initialization" path="./_examples/contexts/UseUuiServices.example.tsx" onlyCode={ true } />
                <DocExample title="Usage" path="./_examples/contexts/UuiServicesUsage.example.tsx" onlyCode={ true } />
                <DocExample title="Advanced setup" path="./_examples/contexts/UseUuiServicesAdvanced.example.tsx" onlyCode={ true } />
                <DocExample title="With react-router v.6" path="./_examples/contexts/UseUuiServicesRR6.example.tsx" onlyCode={ true } />
            </>
        );
    }
}
