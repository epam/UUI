import * as React from 'react';
import { DataTable, DataTableRow } from '@epam/loveship';
import { useDemoDbRef, PersonTableRecord, DemoDb } from './state';
import { DataSourceState, IEditable, DataQueryFilter, IDataSourceView, useLens, DataRowProps } from '@epam/uui';
import { Person } from '@epam/uui-docs';
import { getColumns } from './columns';
import { useDbView } from '@epam/uui-db';

export interface PersonsTableProps extends IEditable<DataSourceState> {
    view: IDataSourceView<PersonTableRecord, number, DataQueryFilter<Person>>;
}

const personDetailsView = (db: DemoDb, rq: { id: number }) => db.persons.byId(rq.id);

const PersonRow = function(props: DataRowProps<Person, number>) {
    const columnsSet = React.useMemo(() => getColumns(dbRef), []);

    const dbRef = useDemoDbRef();
    const details = useDbView(personDetailsView, { id: props.id });

    return <DataTableRow
        columns={ columnsSet.personColumns}
        { ...props }
        value= { details }
    />;
};


export const PersonsTable = (props: PersonsTableProps) => {
    const dbRef = useDemoDbRef();
    const tableLens = useLens(props, b => b.onChange((o ,n) => ({ ...n, topIndex: 0 })));

    const columnsSet = React.useMemo(() => getColumns(dbRef), []);

    const renderRow = (props: DataRowProps<PersonTableRecord, number>) => {
        if (props.value && props.value.__typename == 'Person') {
            return <PersonRow {...props as any} />;
        } else {
            return <DataTableRow {...props} columns={columnsSet.groupColumns} />;
        }
    };

    return <DataTable<PersonTableRecord>
        getRows={ () => props.view.getVisibleRows() }
        columns={ columnsSet.personColumns }
        renderRow={ renderRow }
        selectAll={{ value: false, isDisabled: true, onValueChange: null }}
        { ...tableLens }
        { ... props.view.getListProps() }
    />;
};