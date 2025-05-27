import { DocItem } from '../../documents/structure';

export const DataSourcesAsyncDataSourceDocItem: DocItem = {
    id: 'dataSources-Async-dataSource',
    name: 'AsyncDataSource',
    parentId: 'dataSources',
    examples: [
        { descriptionPath: 'dataSources-Async-dataSource' },
        { name: 'useAsyncDataSource', componentPath: './_examples/dataSources/UseAsyncDataSource.code.example.ts', onlyCode: true },
        { descriptionPath: 'dataSources-async-dataSource-props-overview' },
        { name: 'Data', componentPath: './_examples/dataSources/AsyncDataSourceData.example.tsx', onlyCode: true },
    ],
};
