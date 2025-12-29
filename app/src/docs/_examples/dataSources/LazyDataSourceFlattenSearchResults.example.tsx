import React, { useState } from 'react';
import { Panel, TextInput, FlexRow } from '@epam/uui';
import { DataQueryFilter, DataSourceState, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { Location } from '@epam/uui-docs';
import { DataSourceViewer } from '@epam/uui-docs';
import { TApi } from '../../../data';

export default function LazyDataSourceFlattenSearchResultsExample() {
    const svc = useUuiContext<TApi>();

    const [value1, onValueChange1] = useState<DataSourceState>({});
    const dataSource1 = useLazyDataSource<Location, string, DataQueryFilter<Location>>({
        api: (request, ctx) => {
            const { search } = request;
            // if search is specified, it is required to search over all the children,
            // and since parentId is meaningful value, it is required to exclude it from the filter.
            const filter = search ? {} : { parentId: ctx?.parentId };
            return svc.api.demo.locations({ ...request, search, filter }, { signal: ctx.signal });
        },
        getParentId: ({ parentId }) => parentId,
        getChildCount: (l) => l.childCount,
    }, []);

    return (
        <Panel>
            <FlexRow>
                <TextInput
                    placeholder="Search"
                    value={ value1.search }
                    onValueChange={ (search) => {
                        onValueChange1((state) => ({ ...state, search }));
                    } }
                />
            </FlexRow>
            <FlexRow>
                <DataSourceViewer
                    value={ value1 }
                    onValueChange={ onValueChange1 }
                    dataSource={ dataSource1 }
                />
            </FlexRow>
        </Panel>

    );
}
