import type { DocItem } from '../../documents/structure';

export const DataSourcesArrayDataSourceDocItem: DocItem = {
    id: 'dataSources-array-dataSource',
    name: 'ArrayDataSource',
    parentId: 'dataSources',
    examples: [
        { descriptionPath: 'dataSources-Array-dataSource' },
        { name: 'useArrayDataSource', componentPath: './_examples/dataSources/UseArrayDataSource.code.example.ts', onlyCode: true },
        { name: 'ArrayDataSourceProps', descriptionPath: 'dataSources-array-dataSource-props-overview' },
        { name: 'Data', componentPath: './_examples/dataSources/ArrayDataSourceData.example.tsx' },
        { name: 'Search', componentPath: './_examples/dataSources/ArrayDataSourceSearch.example.tsx' },
        { name: 'Filter', componentPath: './_examples/dataSources/ArrayDataSourceFilter.example.tsx' },
        { name: 'Sorting', componentPath: './_examples/dataSources/ArrayDataSourceSorting.example.tsx' },
    ],
};
