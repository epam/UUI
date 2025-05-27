import { DocItem } from '../../documents/structure';

export const DataSourcesLazyDataSourceDocItem: DocItem = {
    id: 'dataSources-lazy-dataSource',
    name: 'LazyDataSource',
    parentId: 'dataSources',
    examples: [
        { descriptionPath: 'dataSources-lazy-dataSource' },
        { name: 'useLazyDataSource', componentPath: './_examples/dataSources/UseLazyDataSource.code.example.ts', onlyCode: true },
        { name: 'LazyDataSourceProps', descriptionPath: 'dataSources-lazy-dataSource-props-overview' },
        { name: 'LazyDataSourceApi', descriptionPath: 'dataSources-lazy-api-overview' },
        { name: 'Data', componentPath: './_examples/dataSources/LazyDataSourceData.example.tsx' },
        { name: 'How to request flatten data lazily?', componentPath: './_examples/dataSources/LazyDataSourceRequestingFlattenData.example.tsx' },
        { name: 'How to request tree-like data lazily?', componentPath: './_examples/dataSources/LazyDataSourceRequestingTreeLikeData.example.tsx' },
        { name: 'Child count', componentPath: './_examples/dataSources/LazyDataSourceGetChildCount.example.tsx' },
        { name: 'Filter', componentPath: './_examples/dataSources/LazyDataSourceFilter.example.tsx' },
        { name: 'Flatten search results', componentPath: './_examples/dataSources/LazyDataSourceFlattenSearchResults.example.tsx' },
        { name: 'Using cursor-based pagination', componentPath: './_examples/dataSources/LazyDataSourceCursor.example.tsx' },
    ],
};
