import { DocItem } from '../documents/structure';

export const ProgressBarDocItem: DocItem = {
    id: 'progressBar',
    name: 'Progress Bar',
    parentId: 'components',
    examples: [
        { descriptionPath: 'progressBar-descriptions' },
        { name: 'Basic ProgressBar', componentPath: './_examples/progressBar/Basic.example.tsx' },
        { name: 'IndeterminateBar example', componentPath: './_examples/progressBar/IndeterminateBar.example.tsx' },
        { name: 'IndicatorBar example', componentPath: './_examples/progressBar/IndicatorBar.example.tsx' },
    ],
};
