import { DocItem } from '../../documents/structure';

export const PresetsPanelDocItem: DocItem = {
    id: 'presetsPanel',
    name: 'Presets Panel',
    parentId: 'tables',
    examples: [
        { descriptionPath: 'presets-panel-descriptions' },
        { name: 'Basic', componentPath: './_examples/tables/PresetsPanelBasic.example.tsx' },
    ],
    order: 6,
    tags: ['tables', 'dataTable'],
};
