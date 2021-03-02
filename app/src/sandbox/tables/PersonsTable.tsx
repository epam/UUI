import * as React from 'react';
import { DataTable, DataTableRow } from '@epam/loveship';
import { PersonTableFilter, PersonTableRecord, PersonTableRecordId } from './types';
import { DataSourceState, IEditable, DataQueryFilter, IDataSourceView, useLens, DataRowProps } from '@epam/uui';
import { getColumns } from './columns';

export interface PersonsTableProps extends IEditable<DataSourceState> {
    view: IDataSourceView<PersonTableRecord, PersonTableRecordId, DataQueryFilter<PersonTableFilter>>;
}

export const PersonsTable = (props: PersonsTableProps) => {
    const tableLens = useLens(props, b => b.onChange((o , n) => ({ ...n, topIndex: 0 })));

    const columnsSet = React.useMemo(() => getColumns(), []);

    const renderRow = (props: DataRowProps<PersonTableRecord, number>) => {
        let columns = (props.isLoading || props.value?.__typename === 'Person') ? props.columns : columnsSet.groupColumns;
        return <DataTableRow { ...props } columns={ columns } />;
    };

    return (
        <DataTable<PersonTableRecord>
            getRows={ () => props.view.getVisibleRows() }
            columns={ columnsSet.personColumns }
            renderRow={ renderRow }
            selectAll={ { value: false, isDisabled: true, onValueChange: null } }
            { ...tableLens }
            { ... props.view.getListProps() }
        />
    );
};