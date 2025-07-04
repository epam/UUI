import { DocItem } from '../_types/docItem';

export const FiltersPanelDocItem: DocItem = {
    id: 'filtersPanel',
    name: 'Filters Panel',
    parentId: 'tables',
    examples: [
        { descriptionPath: 'filters-panel-descriptions' },
        { name: 'Basic', componentPath: './_examples/tables/FiltersPanelBasic.example.tsx' },
    ],
    order: 5,
    tags: ['tables', 'dataTable'],
};
