import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../common';

export class DataSourcesDataSourceStateDoc extends BaseDocsBlock {
    title = 'DataSource State';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="dataSources-dataSource-state" />

                <EditableDocContent title="DataSourceState" fileName="dataSources-dataSource-description" />

                <DocExample title="Search" path="./_examples/dataSources/DataSourceStateSearch.example.tsx" />
                <DocExample title="Filter" path="./_examples/dataSources/DataSourceStateFilter.example.tsx" />
                <DocExample title="Sorting" path="./_examples/dataSources/DataSourceStateSorting.example.tsx" />
                <DocExample title="Selected Id" path="./_examples/dataSources/DataSourceStateSelectedId.example.tsx" />
                <DocExample title="Checked" path="./_examples/dataSources/DataSourceStateChecked.example.tsx" />
                <DocExample title="Folded" path="./_examples/dataSources/DataSourceStateFolded.example.tsx" />
                <DocExample title="Visible rows count" path="./_examples/dataSources/DataSourceStateVisibleCount.example.tsx" />
                <DocExample title="Index to scroll" path="./_examples/dataSources/DataSourceStateIndexToScroll.example.tsx" />
                <DocExample title="Paging" path="./_examples/dataSources/DataSourceStatePage.example.tsx" />
            </>
        );
    }
}
