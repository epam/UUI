import React, { useMemo, useState } from 'react';
import { ColumnsConfigurationModal, DataTable, FlexRow, Panel, RichTextView, StatusIndicator, Text } from '@epam/promo';
import { DataColumnProps, useLazyDataSource, useUuiContext, UuiContexts } from '@epam/uui-core';
import { Person } from '@epam/uui-docs';
import { ColumnsConfigurationModalProps } from '@epam/uui';
import { TApi } from '../../data';
import css from './TableColumnConfigModalStyles.module.scss';

export function TableColumnConfigModalTest() {
    const svc = useUuiContext<TApi, UuiContexts>();

    const [value, onValueChange] = useState({});

    const dataSource = useLazyDataSource<Person, number, Person>(
        {
            api: svc.api.demo.persons,
        },
        [],
    );

    const view = dataSource.useView(value, onValueChange, {
        getRowOptions: () => ({ checkbox: { isVisible: true } }),
    });

    const productColumns: DataColumnProps<Person>[] = useMemo(
        () => [
            {
                key: 'name',
                caption: 'Name',
                render: (p) => <Text>{p.name}</Text>,
                width: 200,
                fix: 'left',
                isSortable: true,
            }, {
                key: 'profileStatus',
                caption: 'Profile Status',
                render: (p) =>
                    p.profileStatus && (
                        <FlexRow>
                            <StatusIndicator size="18" color={ p.profileStatus.toLowerCase() as any } caption={ p.profileStatus } />
                        </FlexRow>
                    ),
                width: 140,
                minWidth: 80,
                isSortable: true,
                alignSelf: 'center',
                info: 'Person Status according his work profile',
            }, {
                key: 'salary',
                caption: 'Salary',
                render: (p) => <Text>{p.salary}</Text>,
                isSortable: true,
                width: 100,
                textAlign: 'right',
                info: 'Salary sum for the last year',
            }, {
                key: 'jobTitle',
                caption: 'Title',
                render: (r) => <Text>{r.jobTitle}</Text>,
                width: 200,
                grow: 1,
                isSortable: true,
                info: 'Job full description',
            }, {
                key: 'detailed',
                render: () => {},
                width: 54,
                alignSelf: 'center',
                fix: 'right',
                info: 'detailed description',
            },
        ],
        [],
    );

    const columnsConfigurationModal = (props: ColumnsConfigurationModalProps<any, any, any>) => {
        const { columns, columnsConfig, defaultConfig, ...modalProps } = props;
        return (
            <ColumnsConfigurationModal
                { ...modalProps }
                columns={ columns }
                columnsConfig={ columnsConfig }
                defaultConfig={ defaultConfig }
                getSearchFields={ (column) => [column.caption as string, column.info as string] }
                renderItem={ (column) => (
                    <FlexRow>
                        <Text>{column.caption}</Text>
                        { column.info && <Text fontSize="12" color="gray50" rawProps={ { style: { paddingBottom: '7px', paddingLeft: '3px' } } }>{ ` / ${column.info}` }</Text> }
                    </FlexRow>
                ) }
            />
        );
    };

    return (
        <Panel shadow cx={ [css.container, css.uuiThemePromo] }>
            <RichTextView>
                <h3>Table example with ColumnConfigModal</h3>
            </RichTextView>
            <Panel shadow cx={ css.tableContainer }>
                <DataTable
                    { ...view.getListProps() }
                    getRows={ view.getVisibleRows }
                    value={ value }
                    onValueChange={ onValueChange }
                    columns={ productColumns }
                    showColumnsConfig={ true }
                    allowColumnsResizing={ true }
                    allowColumnsReordering={ true }
                    renderColumnsConfigurationModal={ columnsConfigurationModal }
                />
            </Panel>
        </Panel>
    );
}
