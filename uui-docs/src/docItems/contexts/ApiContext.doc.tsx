import { DocItem } from '../_types/docItem';

export const ApiContextDocItem: DocItem = {
    id: 'apiContext',
    name: 'Api Context and Error Handling',
    parentId: 'contexts',
    examples: [
        { descriptionPath: 'api-context-descriptions' },
        { name: 'How to send a request', componentPath: './_examples/contexts/apiContext/SendRequest.example.tsx', onlyCode: true },
        { name: 'Congigure error handling type', componentPath: './_examples/contexts/apiContext/ErrorHandlingTypes.example.tsx' },
        { name: 'Auth and Connection lost handling', componentPath: './_examples/contexts/apiContext/AuthAndConnectionLostHandling.example.tsx' },
        { name: 'Throw errors from your code', componentPath: './_examples/contexts/apiContext/ApiContextThrowUUIError.example.tsx' },
        { name: 'Custom fetcher', componentPath: './_examples/contexts/apiContext/CustomFetch.example.tsx', onlyCode: true },
    ],
    tags: ['contexts'],
};
