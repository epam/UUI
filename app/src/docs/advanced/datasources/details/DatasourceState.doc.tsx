import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../../../common';

export class DatasourcesDatasourceStateDoc extends BaseDocsBlock {
    title = 'Datasource State';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="datasources-datasource-state" />
                <DocExample title="Search" path="./_examples/datasources/DatasourceStateSearch.example.tsx" />
                <DocExample title="Filter" path="./_examples/datasources/DatasourceStateFilter.example.tsx" />
                <DocExample title="Sorting" path="./_examples/datasources/DatasourceStateSorting.example.tsx" />
                <DocExample title="Selected Id" path="./_examples/datasources/DatasourceStateSelectedId.example.tsx" />
                <DocExample title="Checked" path="./_examples/datasources/DatasourceStateChecked.example.tsx" />
                <DocExample title="Folded" path="./_examples/datasources/DatasourceStateFolded.example.tsx" />
                <DocExample title="Visible rows count" path="./_examples/datasources/DatasourceStateVisibleCount.example.tsx" />
                <DocExample title="Index to scroll" path="./_examples/datasources/DatasourceStateIndexToScroll.example.tsx" />
                <DocExample title="Paging" path="./_examples/datasources/DatasourceStatePage.example.tsx" />
            </>
        );
    }
}
