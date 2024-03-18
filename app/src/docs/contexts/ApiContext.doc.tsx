import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../../common';

export class ApiContextDoc extends BaseDocsBlock {
    title = 'Api Context and Error Handling';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="api-context-descriptions" />

                <DocExample title="How to send a request" path="./_examples/contexts/apiContext/SendRequest.example.tsx" onlyCode={ true } />

                <DocExample title="Congigure error handling type" path="./_examples/contexts/apiContext/ErrorHandlingTypes.example.tsx" />

                <DocExample title="Auth and Connection lost handling" path="./_examples/contexts/apiContext/AuthAndConnectionLostHandling.example.tsx" />

                <DocExample title="Throw errors from your code" path="./_examples/contexts/apiContext/ApiContextThrowUUIError.example.tsx" />

                <DocExample title="Custom fetcher" path="./_examples/contexts/apiContext/CustomFetch.example.tsx" onlyCode={ true } />
            </>
        );
    }
}
