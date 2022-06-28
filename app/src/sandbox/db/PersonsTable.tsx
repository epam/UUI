import * as React from 'react';
import { DataTable, DataTableRow } from '@epam/loveship';
import { useDemoDbRef, PersonTableRecord, DemoDb } from './state';
import { DataSourceState, IEditable, DataQueryFilter, IDataSourceView, DataRowProps, Lens } from '@epam/uui';
import { Person } from '@epam/uui-docs';
import { personColumns, groupColumns } from './columns';
import { useDbView } from '@epam/uui-db';

export interface PersonsTableProps extends IEditable<DataSourceState> {
    view: IDataSourceView<PersonTableRecord, number, DataQueryFilter<Person>>;
}

const personDetailsView = (db: DemoDb, rq: { id: number }) => db.persons.byId(rq.id);

const PersonRow = function (props: DataRowProps<Person, number>) {
    const dbRef = useDemoDbRef();
    const details = useDbView(personDetailsView, { id: props.id });

    const onValueChange = React.useCallback(
        (newValue: Person) => dbRef.commit({ persons: [{ id: props.id, ...newValue }]}),
        [],
    );

    return <DataTableRow
        columns={ personColumns }
        { ...props }
        value={ details }
        onValueChange={ onValueChange }
    />;
};

export const PersonsTable = (props: PersonsTableProps) => {
    const dbRef = useDemoDbRef();

    const tableLens = Lens.onEditable(props).onChange((o , n) => ({ ...n, topIndex: 0 }));

    const renderRow = (props: DataRowProps<Person, number>) => {
        if (props.value && props.value.__typename == 'Person') {
            return <PersonRow key={ props.id } { ...props } />;
        } else {
            return <DataTableRow key={ props.id } { ...props } columns={ groupColumns } />;
        }
    };

    return <DataTable<PersonTableRecord, Person['id']>
        getRows={ () => props.view.getVisibleRows() }
        columns={ personColumns }
        renderRow={ renderRow }
        selectAll={ { value: false, isDisabled: true, onValueChange: null } }
        allowColumnsReordering
        allowColumnsResizing
        { ...tableLens.toProps() }
        { ... props.view.getListProps() }
    />;
};