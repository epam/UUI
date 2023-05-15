import React, {
    useCallback, useEffect, useMemo, useState,
} from 'react';
import { Person } from '@epam/uui-docs';
import {
    cx, useLazyDataSource, useUuiContext, UuiContexts, ITablePreset, useTableState, DataRowProps,
} from '@epam/uui-core';
import { FlexRow } from '@epam/uui';
import { DataTable } from '@epam/promo';
import css from './DemoTable.module.scss';
import type { TApi } from '../../../data';
import { getFilters } from './filters';
import { personColumns } from './columns';
import { FilterPanel } from './FilterPanel';
import { InfoSidebarPanel } from './InfoSidebarPanel';
import { SlidingPanel } from './SlidingPanel';
import { FilterPanelOpener } from './FilterPanelOpener';

export function MasterDetailedTable() {
    const svc = useUuiContext<TApi, UuiContexts>();
    const [isFilterPanelOpened, setIsFilterPanelOpened] = useState(false);
    const [isInfoPanelOpened, setIsInfoPanelOpened] = useState(false);
    const closeInfoPanel = useCallback(() => setIsInfoPanelOpened(false), []);

    const [initialPresets, setInitialPresets] = useState<ITablePreset[]>([]);
    const filters = useMemo(getFilters, []);

    useEffect(() => {
        svc.api.presets.getPresets().then(setInitialPresets).catch(console.error);
    }, []);

    const tableStateApi = useTableState({
        columns: personColumns,
        initialPresets: initialPresets,
        onPresetCreate: svc.api.presets.createPreset,
        onPresetUpdate: svc.api.presets.updatePreset,
        onPresetDelete: svc.api.presets.deletePreset,
    });

    const dataSource = useLazyDataSource<Person, number, Person>(
        {
            api: (request) => svc.api.demo.persons(request),
        },
        [],
    );

    const clickHandler = useCallback((rowProps: DataRowProps<Person, number>) => {
        rowProps.onSelect(rowProps);
        setIsInfoPanelOpened(true);
    }, []);

    const view = dataSource.useView(tableStateApi.tableState, tableStateApi.setTableState, {
        rowOptions: {
            checkbox: { isVisible: true },
            isSelectable: true,
            onClick: clickHandler,
        },
    });

    return (
        <div className={ css.wrapper }>
            <FilterPanelOpener isFilterPanelOpened={ isFilterPanelOpened } setIsFilterPanelOpened={ setIsFilterPanelOpened } />

            <SlidingPanel isVisible={ isFilterPanelOpened } width={ 288 } position="left">
                <FilterPanel { ...tableStateApi } filters={ filters } columns={ personColumns } closePanel={ () => setIsFilterPanelOpened(false) } />
            </SlidingPanel>

            <div className={ css.container }>
                <FlexRow borderBottom cx={ cx(css.presets, { [css.presetsWithFilter]: isFilterPanelOpened }) }></FlexRow>

                <DataTable
                    headerTextCase="upper"
                    getRows={ view.getVisibleRows }
                    columns={ personColumns }
                    filters={ filters }
                    value={ tableStateApi.tableState }
                    onValueChange={ tableStateApi.setTableState }
                    showColumnsConfig={ true }
                    allowColumnsResizing
                    allowColumnsReordering
                    { ...view.getListProps() }
                />
            </div>

            <InfoSidebarPanel
                data={ tableStateApi.tableState.selectedId && (view.getById(tableStateApi.tableState.selectedId, 0).value as Person) }
                isVisible={ isInfoPanelOpened }
                onClose={ closeInfoPanel }
            />
        </div>
    );
}
