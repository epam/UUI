import React, { useMemo, useState } from 'react';
import { DataColumnProps, DataSourceState, DataTableRowProps, useArrayDataSource } from '@epam/uui-core';
import { DataTable, DataTableRow, Panel, Text } from '@epam/uui';
import { demoData, FeatureClass } from '@epam/uui-docs';
import css from './TableWithExpandableRows.module.scss';

interface DataSourceStateWithExpanded<TId, TFilter = any> extends DataSourceState<TFilter, TId> {
    expanded?: Record<string, boolean>;
}

export default function TableWithExpandableRowsExample() {
    const [dataSourceState, setDataSourceState] = useState<DataSourceStateWithExpanded<number, unknown>>({});

    const dataSource = useArrayDataSource<FeatureClass, number, unknown>(
        {
            items: demoData.featureClasses,
        },
        [],
    );

    const view = dataSource.useView(dataSourceState, setDataSourceState, {});

    const productColumns: DataColumnProps<FeatureClass>[] = useMemo(
        () => [
            {
                key: 'id',
                caption: 'Id',
                render: (item) => <Text color="primary">{item.id}</Text>,
                isSortable: true,
                isAlwaysVisible: true,
                width: 150,
            }, {
                key: 'name',
                caption: 'Name',
                render: (item) => <Text color="primary">{item.name}</Text>,
                isSortable: true,
                width: 1000,
            },
        ],
        [],
    );

    const renderRow = (props: DataTableRowProps<FeatureClass, any>): React.ReactNode => {
        const isExpanded = dataSourceState.expanded?.[props.id];
        return (
            <div className={ isExpanded ? css.rowWithDetails : null }>
                <DataTableRow
                    key={ props.rowKey }
                    size="36"
                    columnsGap="24"
                    { ...props }
                    indent={ (props.indent ?? 0) + 1 }
                    isFoldable={ true }
                    isFolded={ !isExpanded }
                    onFold={ (props) => setDataSourceState((current) => ({ ...current, expanded: { ...current.expanded, [props.id]: !current.expanded?.[props.id] } })) }
                />
                {isExpanded && <div className={ css.details }><Text>{ props.value.description ?? 'No description' }</Text></div> }
            </div>
        );
    };

    return (
        <Panel background="surface-main" shadow cx={ css.container }>
            <DataTable
                { ...view.getListProps() }
                getRows={ view.getVisibleRows }
                value={ dataSourceState }
                onValueChange={ setDataSourceState }
                columns={ productColumns }
                renderRow={ renderRow }
                headerTextCase="upper"
            />
        </Panel>
    );
}
