import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../../common';

export class DataSourcesBaseDataSourcePropsDoc extends BaseDocsBlock {
    title = 'DataSource Props';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="dataSources-base-props" />

                <DocExample title="Common DataSource Props" path="./_examples/dataSources/BaseDataSourceProps.code.example.ts" onlyCode={ true } />
                <EditableDocContent fileName="dataSources-base-props-overview" />
                
                <DocExample title="getId and getParentId" path="./_examples/dataSources/DataSourcePropsIds.example.tsx" />
                <DocExample title="complexIds" path="./_examples/dataSources/DataSourcePropsComplexIds.example.tsx" />
                <DocExample title="isFoldedByDefault" path="./_examples/dataSources/DataSourcePropsIsFoldedByDefault.example.tsx" />
                <DocExample title="cascadeSelection" path="./_examples/dataSources/DataSourcePropsCascadeSelection.example.tsx" />
                <DocExample title="selectAll" path="./_examples/dataSources/DataSourcePropsSelectAll.example.tsx" />
            </>
        );
    }
}
