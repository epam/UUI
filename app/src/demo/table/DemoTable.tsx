import React, { useCallback, useEffect, useMemo, useState } from "react";
import css from "./DemoTable.scss";
import { DataRowProps, DataRowOptions, cx, useLazyDataSource } from "@epam/uui";
import { Person } from "@epam/uui-docs";
import { FlexRow, DataTable, DataTableRow } from "@epam/promo";

import { svc } from "../../services";
import { api, getFilters } from "./data";
import { getColumns } from "./columns";
import { ITablePreset, PersonTableRecord, PersonTableRecordId } from "./types";
import { useTableState } from "./hooks";
import { FilterPanel } from "./FilterPanel";
import { InfoSidebarPanel } from "./InfoSidebarPanel";
import { Presets } from "./Presets";
import { SlidingPanel } from "./SlidingPanel";
import { FilterPanelOpener } from "./FilterPanelOpener";

export const DemoTable: React.FC = () => {
    const [isFilterPanelOpened, setIsFilterPanelOpened] = useState(false);
    const [isInfoPanelOpened, setIsInfoPanelOpened] = useState(false);
    const closeInfoPanel = useCallback(() => setIsInfoPanelOpened(false), []);

    const [initialPresets, setInitialPresets] = useState<ITablePreset[]>([]);
    const filters = useMemo(getFilters, []);
    const columnsSet = useMemo(getColumns, []);

    useEffect(() => {
        svc.api.presets.getPresets()
            .then(setInitialPresets)
            .catch(console.error);
    }, []);

    const tableStateApi = useTableState({
        columns: columnsSet.personColumns,
        initialPresets: initialPresets,
        onPresetCreate: svc.api.presets.createPreset,
        onPresetUpdate: svc.api.presets.updatePreset,
        onPresetDelete: svc.api.presets.deletePreset,
    });

    const dataSource = useLazyDataSource({
        api,
        getId: i => [i.__typename, i.id] as PersonTableRecordId,
        getChildCount: item => item.__typename === "PersonGroup" ? item.count : null,
    }, []);

    const rowOptions: DataRowOptions<PersonTableRecord, PersonTableRecordId> = {
        checkbox: { isVisible: true },
        isSelectable: true,
        onClick(rowProps) {
            rowProps.onSelect(rowProps);
            setIsInfoPanelOpened(true);
        },
    };

    const renderRow = (props: DataRowProps<PersonTableRecord, PersonTableRecordId>) => {
        const columns = (props.isLoading || props.value?.__typename === "Person") ? props.columns : columnsSet.groupColumns;
        return <DataTableRow key={ props.rowKey } { ...props } size="36" columns={ columns } />;
    };

    const personsDataView = dataSource.useView(tableStateApi.tableState, tableStateApi.setTableState, {
        rowOptions,
        isFoldedByDefault: () => true,
        cascadeSelection: true,
    });

    return (
        <div className={ css.wrapper }>
            <FilterPanelOpener
                isFilterPanelOpened={ isFilterPanelOpened }
                setIsFilterPanelOpened={ setIsFilterPanelOpened }
            />

            <SlidingPanel isVisible={ isFilterPanelOpened } width={ 288 } position="left">
                <FilterPanel
                    { ...tableStateApi }
                    filters={ filters }
                    columns={ columnsSet.personColumns }
                    closePanel={ () => setIsFilterPanelOpened(false) }
                />
            </SlidingPanel>

            <div className={ css.container }>
                <FlexRow
                    background="white"
                    borderBottom
                    cx={ cx(css.presets, { [css.presetsWithFilter]: isFilterPanelOpened }) }
                >
                    <Presets { ...tableStateApi } />
                </FlexRow>

                <DataTable
                    headerTextCase="upper"
                    getRows={ personsDataView.getVisibleRows }
                    columns={ columnsSet.personColumns }
                    filters={ filters }
                    renderRow={ renderRow }
                    showColumnsConfig
                    value={ tableStateApi.tableState }
                    onValueChange={ tableStateApi.setTableState }
                    allowColumnsResizing
                    { ...personsDataView.getListProps() }
                />
            </div>

            <InfoSidebarPanel
                data={ dataSource.getById(["Person", tableStateApi.tableState.selectedId?.[1]]) as Person }
                isVisible={ isInfoPanelOpened }
                onClose={ closeInfoPanel }
            />
        </div>
    );
};