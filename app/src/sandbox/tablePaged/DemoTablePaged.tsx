import React, { useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { Person } from '@epam/uui-docs';
import { FlexCell } from '@epam/uui-components';
import { DataRowOptions, LazyDataSourceApi, useTableState, useLazyDataSource } from '@epam/uui-core';
import { DataTable, FlexRow, Paginator, FlexSpacer, Button } from '@epam/uui';
import { svc } from '../../services';
import { getFilters } from './filters';
import { personColumns } from './columns';
import css from './DemoTablePaged.module.scss';
import { InfoSidebarPanel } from './InfoSidebarPanel';

export function DemoTablePaged() {
    const filters = useMemo(getFilters, []);
    const [isInfoPanelOpened, setIsInfoPanelOpened] = useState(false);
    const closeInfoPanel = useCallback(() => setIsInfoPanelOpened(false), []);

    const { tableState, setTableState } = useTableState<Person>({});

    useEffect(() => {
        setTableState({ ...tableState, page: 1, pageSize: 100 });
    }, []);

    const api: LazyDataSourceApi<Person, number, Person> = useCallback(async (request) => {
        const result = await svc.api.demo.personsPaged({
            filter: request.filter,
            page: request.page,
            pageSize: request.pageSize,
        });

        result.count = result.items.length;
        result.from = 0;
        return result;
    }, []);

    const applyFilter = useCallback(() => {
        setTableState((state) => ({ ...state, scrollTo: { index: 0 } }));
    }, [setTableState]);

    // applying filter after parsing initial filter data from url
    useEffect(() => {
        applyFilter();
    }, [applyFilter]);

    const rowOptions: DataRowOptions<Person, number> = {
        checkbox: { isVisible: true },
        isSelectable: true,
        onClick(rowProps) {
            rowProps.onSelect(rowProps);
            setIsInfoPanelOpened(true);
        },
    };

    const dataSource = useLazyDataSource({
        api,
        rowOptions,
        getId: ({ id }) => id,
        isFoldedByDefault: () => true,
        backgroundReload: true,
    }, []);

    const view = dataSource.useView(tableState, setTableState, {});

    const panelInfo = tableState.selectedId && (view.getById(tableState.selectedId, 0).value);

    const listProps = view.getListProps();

    return (
        <div className={ cx(css.container, css.uuiThemePromo) }>
            <div className={ cx(css.wrapper) }>
                <DataTable
                    headerTextCase="upper"
                    getRows={ view.getVisibleRows }
                    columns={ personColumns }
                    filters={ filters }
                    showColumnsConfig
                    value={ tableState }
                    onValueChange={ setTableState }
                    allowColumnsResizing
                    { ...listProps }
                />
                <FlexRow size="36" padding="12" background="surface-main">
                    <FlexCell width="auto">
                        <Button caption="Apply filter" onClick={ applyFilter } cx={ css.apply } />
                    </FlexCell>
                    <FlexSpacer />
                    <Paginator
                        value={ tableState.page }
                        onValueChange={ (page: number) => setTableState({ ...tableState, page, scrollTo: { index: 0 } }) }
                        totalPages={ Math.ceil(listProps.totalCount / tableState.pageSize) }
                    />
                    <FlexSpacer />
                </FlexRow>
            </div>
            <InfoSidebarPanel
                data={ panelInfo }
                isVisible={ isInfoPanelOpened }
                onClose={ closeInfoPanel }
                onSave={ async () => { view.reload(); } }
            />
        </div>
    );
}
