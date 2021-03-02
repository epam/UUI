import * as React from 'react';
import { DataSourceState, useLens, IEditable, ArrayDataSource, LazyDataSource, DataRowProps, LazyDataSourceApi, DataRowOptions } from '@epam/uui';
import { PersonGroup } from '@epam/uui-docs';
import { FlexRow, FlexCell, SearchInput, Text, PickerInput, DataTable, DataTableRow } from '@epam/promo';
import { svc } from '../../services';
import { PersonTableFilter, PersonTableRecord, PersonTableRecordId } from './types';
import { getColumns } from './columns';
import * as css from './DemoTable.scss';

export const api: LazyDataSourceApi<PersonTableRecord, PersonTableRecordId, PersonTableFilter> = (request, ctx) => {
    let { ids: clientIds, filter: { groupBy, ...filter }, ...rq } = request;

    let ids = clientIds && clientIds.map(clientId => clientId[1]) as any[];

    if (groupBy && !ctx.parent) {
        return svc.api.demo.personGroups({ ...rq, filter: { groupBy }, search: null, itemsRequest: { filter, search: rq.search }, ids } as any);
    } else {
        const parentFilter = ctx.parent && { [groupBy + 'Id']: ctx.parent.id };
        return svc.api.demo.persons({ ...rq, filter: { ...filter, ...parentFilter }, ids });
    }
};

interface PersonsTableState extends DataSourceState {
    isFolded?: boolean;
}

export const DemoTable: React.FC<{}> = (props) => {
    const groupings = React.useMemo(() => [
        { id: 'jobTitle', name: "Job Title" },
        { id: 'department', name: "Department" },
    ], []);

    const groupingDataSource = React.useMemo(() => new ArrayDataSource({ items: groupings }), []);

    const [value, onValueChange] = React.useState<PersonsTableState>(() => ({
        topIndex: 0,
        visibleCount: 100,
        sorting: [{ field: 'name' }],
        isFolded: true,
    }));

    const editable: IEditable<DataSourceState> = { value, onValueChange };

    let dataSource = React.useMemo(() => new LazyDataSource({
        api,
        getId: (i) => [i.__typename, i.id] as PersonTableRecordId,
        getChildCount: (item: PersonTableRecord) =>
            item.__typename === 'PersonGroup' ? item.count : null,
    }), []);

    const rowOptions: DataRowOptions<PersonTableRecord, PersonTableRecordId> = {
        checkbox: { isVisible: true },
    };

    const tableLens = useLens(useLens(editable, b => b), b => b.onChange((o , n) => ({ ...n, topIndex: 0 })));

    const columnsSet = React.useMemo(() => getColumns(), []);

    const renderRow = (props: DataRowProps<PersonTableRecord, PersonTableRecordId>) => {
        let columns = (props.isLoading || props.value?.__typename === 'Person') ? props.columns : columnsSet.groupColumns;
        return <DataTableRow key={ props.rowKey } { ...props } size='36' columns={ columns } />;
    };

    const personsDataView = dataSource.useView(value, onValueChange, {
        rowOptions,
        isFoldedByDefault: () => value.isFolded,
        cascadeSelection: true,
    });

    return <div className={ css.container }>
        <FlexRow spacing='12' padding='24' vPadding='12' borderBottom={ true } >
            <FlexCell width={ 200 }>
                <SearchInput { ...useLens(editable, b => b.prop('search')) } size='30' />
            </FlexCell>
            <FlexCell width='auto'>
                <Text size='30'>Group By:</Text>
            </FlexCell>
            <FlexCell width={ 130 }>
                <PickerInput { ...useLens(editable, b => b.prop('filter').prop('groupBy')) } dataSource={ groupingDataSource } selectionMode='single' valueType='id' size='30' />
            </FlexCell>
        </FlexRow>
        <DataTable
            headerTextCase='upper'
            getRows={ () => personsDataView.getVisibleRows() }
            columns={ columnsSet.personColumns }
            renderRow={ renderRow }
            selectAll={ { value: false, isDisabled: true, onValueChange: null } }
            showColumnsConfig
            allowColumnsResizing={ true }
            allowColumnsReordering={ true }
            { ...tableLens }
            { ...personsDataView.getListProps() }
       />
    </div>;
};