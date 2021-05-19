import React, { useCallback, useMemo, useState } from 'react';
import { DataTable, Panel, Text, Paginator, FlexRow } from "@epam/promo";
import { DataColumnProps, useLazyDataSource, DataSourceState, LazyDataSourceApi, LazyDataSource, LazyDataSourceApiRequest } from '@epam/uui';
import { Person } from '@epam/uui-docs';
import { svc } from "../../../services";
import * as css from './TablesExamples.scss';
import { FlexSpacer } from '@epam/uui-components';

export interface PagedTableState extends DataSourceState<{}> {
    page?: number;
}

const columns: DataColumnProps<Person>[] = [
    {
        key: 'name',
        caption: 'NAME',
        render: person => <Text color='gray80' font='sans-semibold'>{ person.name }</Text>,
        isSortable: true,
        grow: 1, minWidth: 224,
    }, {
        key: 'location',
        caption: 'LOCATION',
        render: person => <Text>{ person.locationName }</Text>,
        grow: 0, shrink: 0, width: 144,
    },
];

export function PagedTable() {
    const [value, onValueChange] = useState<PagedTableState>({ page: 1, visibleCount: 15 });

    const dataSource = useLazyDataSource<Person, number, any>({
        api: (rq: LazyDataSourceApiRequest<{}>) => {
            return svc.api.demo.personsPaged({ ...rq, page: value.page, pageSize: 200 })
        },
    }, [value.page]);

    const view = dataSource.useView(value, onValueChange, {});

    return (
        <Panel shadow cx={ css.container }>
            <DataTable
                { ...view.getListProps() }
                getRows={ view.getVisibleRows }
                value={ value }
                onValueChange={ onValueChange }
                columns={ columns }
                headerTextCase='upper'
            />
            <FlexRow size='36' padding='12' background='gray5'>
                <FlexSpacer />
                <Paginator
                    value={ value.page}
                    onValueChange={ newPage => onValueChange({ ...value, page: newPage })}
                    totalPages={ 10 }
                    size='30'
                />
                <FlexSpacer />
            </FlexRow>
        </Panel>
    );
}
