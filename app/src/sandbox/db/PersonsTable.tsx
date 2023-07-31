import React from 'react';
import { DataTable, DataTableRow } from '@epam/loveship';
import { useDemoDbRef, PersonTableRecord, DemoDb } from './state';
import {
    DataSourceState, IEditable, DataRowProps, Lens, DataSourceListProps, DataColumnProps,
} from '@epam/uui-core';
import { Person } from '@epam/uui-docs';
import { getColumns } from './columns';
import { useDbView } from '@epam/uui-db';

export interface PersonsTableProps extends IEditable<DataSourceState> {
    rows: DataRowProps<PersonTableRecord, number>[];
    listProps: DataSourceListProps;
}

const personDetailsView = (db: DemoDb, rq: { id: number }) => db.persons.byId(rq.id);

const PersonRow = function (props: DataRowProps<Person, number>) {
    const dbRef = useDemoDbRef();

    const columnsSet = React.useMemo(() => getColumns(dbRef), []);
    const details = useDbView(personDetailsView, { id: props.id });

    return <DataTableRow columns={ columnsSet.personColumns } { ...props } value={ details } />;
};

export function PersonsTable(props: PersonsTableProps) {
    const dbRef = useDemoDbRef();
    const tableLens = Lens.onEditable(props).onChange((o, n) => ({ ...n, topIndex: 0 }));

    const columnsSet = React.useMemo(() => getColumns(dbRef), []);

    const renderRow = (props: DataRowProps<Person, number>) => {
        if (props.value && props.value.__typename === 'Person') {
            return <PersonRow key={ props.id } { ...props } />;
        } else {
            return <DataTableRow key={ props.id } { ...props } columns={ columnsSet.groupColumns } />;
        }
    };

    return (
        <DataTable<PersonTableRecord, Person['id']>
            getRows={ () => props.rows }
            columns={ columnsSet.personColumns as DataColumnProps<PersonTableRecord, number, any>[] }
            renderRow={ renderRow }
            selectAll={ { value: false, isDisabled: true, onValueChange: null } }
            { ...tableLens.toProps() }
            { ...props.listProps }
        />
    );
}
