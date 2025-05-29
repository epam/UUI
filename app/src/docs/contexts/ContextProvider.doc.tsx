import { DocItem } from '../../documents/structure';

export const ContextProviderDocItem: DocItem = {
    id: 'contextProvider',
    name: 'Context Provider',
    parentId: 'contexts',
    examples: [
        { descriptionPath: 'context-provider-descriptions' },
        { name: 'Initialization', componentPath: './_examples/contexts/UseUuiServices.example.tsx', onlyCode: true },
        { name: 'Usage', componentPath: './_examples/contexts/UuiServicesUsage.example.tsx', onlyCode: true },
        { name: 'Advanced setup', componentPath: './_examples/contexts/UseUuiServicesAdvanced.example.tsx', onlyCode: true },
        { name: 'With react-router v.6', componentPath: './_examples/contexts/UseUuiServicesRR6.example.tsx', onlyCode: true },
    ],
    tags: ['contexts'],
};
