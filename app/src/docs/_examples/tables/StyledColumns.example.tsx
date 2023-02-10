import React, { useMemo, useState } from 'react';
import { Badge, DataTable, EpamAdditionalColor, FlexRow, Panel, Text } from "@epam/promo";
import { DataColumnProps, useLazyDataSource, useUuiContext, UuiContexts } from '@epam/uui';
import { Person } from '@epam/uui-docs';
import css from './TablesExamples.scss';
import { TApi } from "../../../data";

export default function StyledColumnsExample() {
    const svc = useUuiContext<TApi, UuiContexts>();

    const [value, onValueChange] = useState({});

    const dataSource = useLazyDataSource<Person, number, Person>({
        api: svc.api.demo.persons,
    }, []);

    const view = dataSource.useView(value, onValueChange, {
        getRowOptions: item => ({ checkbox: { isVisible: true } }),
    });

    const productColumns: DataColumnProps<Person>[] = useMemo(() => [
        {
            key: 'name',
            caption: "Name",
            render: p => <Text>{ p.name }</Text>,
            width: 200,
            fix: 'left',
            isSortable: true,
            textAlign: 'right',
            alignSelf: 'center',
        },
        {
            key: 'profileStatus',
            caption: 'Profile Status',
            render: p => p.profileStatus && <FlexRow>
                <Badge
                    fill="transparent"
                    color={ p.profileStatus.toLowerCase() as EpamAdditionalColor }
                    caption={ p.profileStatus } />
            </FlexRow>,
            grow: 0,
            shrink: 0,
            width: 140,
            isSortable: true,
            isFilterActive: f => !!f.profileStatusId,
            alignSelf: 'center',
        },
        {
            key: 'jobTitle',
            caption: "Title",
            render: r => <Text>{ r.jobTitle }</Text>,
            width: 200,
            isSortable: true,
            isFilterActive: f => !!f.jobTitleId,
            textAlign: 'left',
        },
        {
            key: 'departmentName',
            caption: "Department",
            render: p => <Text>{ p.departmentName }</Text>,
            grow: 0,
            shrink: 0,
            width: 200,
            isSortable: true,
            isFilterActive: f => !!f.departmentId,
            isHiddenByDefault: true,
        },
        {
            key: 'officeAddress',
            caption: "Office",
            render: p => <Text>{ p.officeAddress }</Text>,
            grow: 0,
            shrink: 0,
            isSortable: true,
            isFilterActive: f => !!f.officeId,
            minWidth: 100,
            width: 200,
            justifyContent: 'space-between',
        },
        {
            key: 'detailed',
            render: () => {},
            width: 54,
            alignSelf: 'center',
            fix: 'right',
        },
    ], []);

    return (
        <Panel shadow cx={ css.container }>
            <DataTable
                { ...view.getListProps() }
                getRows={ view.getVisibleRows }
                value={ value }
                onValueChange={ onValueChange }
                columns={ productColumns }
                headerTextCase='upper'
                showColumnsConfig={ true }
                allowColumnsResizing={ true }
                allowColumnsReordering={ true }
            />
        </Panel>
    );
}
