import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../../common';

export class ApiContextDoc extends BaseDocsBlock {
    title = 'Api Context and Error Handling';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="api-context-descriptions" />

                {this.renderSectionTitle('Examples')}

                <DocExample title="Handle server errors" path="./_examples/contexts/apiContext/ApiContextBase.example.tsx" />

                <DocExample title="Throw errors from your code" path="./_examples/contexts/apiContext/ApiContextThrowUUIError.example.tsx" />

                <DocExample title="Custom fetcher" path="./_examples/contexts/apiContext/CustomFetch.example.tsx" onlyCode={ true } />
            </>
        );
    }
}
