import { DocItem } from '../../documents/structure';

export const DataSourcesBaseDataSourcePropsDocItem: DocItem = {
    id: 'dataSources-base-props',
    name: 'DataSource Props',
    parentId: 'dataSources',
    examples: [
        { descriptionPath: 'dataSources-base-props' },
        { name: 'Common DataSource Props', descriptionPath: 'dataSources-base-props-overview' },
        { name: 'getId and getParentId', componentPath: './_examples/dataSources/DataSourcePropsIds.example.tsx' },
        { name: 'complexIds', componentPath: './_examples/dataSources/DataSourcePropsComplexIds.example.tsx' },
        { name: 'isFoldedByDefault', componentPath: './_examples/dataSources/DataSourcePropsIsFoldedByDefault.example.tsx' },
        { name: 'cascadeSelection', componentPath: './_examples/dataSources/DataSourcePropsCascadeSelection.example.tsx' },
        { name: 'selectAll', componentPath: './_examples/dataSources/DataSourcePropsSelectAll.example.tsx' },
        { name: 'showSelectedOnly', componentPath: './_examples/dataSources/DataSourcePropsShowSelectedOnly.example.tsx' },
        { name: 'patch', componentPath: './_examples/dataSources/DataSourcePropsPatch.example.tsx' },
        { name: 'isDeleted', componentPath: './_examples/dataSources/DataSourcePropsPatchIsDeleted.example.tsx' },
        { name: 'getNewItemPosition', componentPath: './_examples/dataSources/DataSourcePropsPatchGetNewItemPosition.example.tsx' },
        { name: 'fixItemBetweenSortings', componentPath: './_examples/dataSources/DataSourcePropsPatchFixItemBetweenSortings.example.tsx' },
    ],
};
