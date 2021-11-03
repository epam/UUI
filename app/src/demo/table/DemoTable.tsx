import React, { useCallback, useMemo, useState } from "react";
import css from "./DemoTable.scss";
import { DataRowProps, DataRowOptions, cx, useLazyDataSource } from "@epam/uui";
import { Person, PersonGroup } from "@epam/uui-docs";
import { FlexRow, DataTable, DataTableRow } from "@epam/promo";

import { getFilters, api } from "./data";
import { getColumns } from "./columns";
import { ITablePreset, PersonTableRecord, PersonTableRecordId } from "./types";
import { useTableState } from "./hooks";
import { FilterPanel } from "./FilterPanel";
import { InfoSidebarPanel } from "./InfoSidebarPanel";
import { Presets } from "./Presets";

export const DemoTable: React.FC = () => {
    const [isFilterPanelOpened, setIsFilterPanelOpened] = useState(false);
    const [infoPanelId, setInfoPanelId] = useState<number | null>(null);
    const closeInfoPanel = useCallback(() => setInfoPanelId(null), []);

    const filters = useMemo(getFilters, []);
    const columnsSet = useMemo(() => getColumns(filters, setInfoPanelId), []);

    const tableStateApi = useTableState({
        columns: columnsSet.personColumns,
        initialPresets: JSON.parse(localStorage.getItem("presets")) ?? [],
        onPresetCreate: async preset => {
            const presets = (JSON.parse(localStorage.getItem("presets")) ?? []) as ITablePreset[];
            const newId = presets.length
                ? Math.max.apply(null, presets.map(p => p.id)) + 1
                : 1;
            preset.id = newId;
            localStorage.setItem("presets", JSON.stringify([...presets, preset]));
            return Promise.resolve(newId);
        },
        onPresetUpdate: async preset => {
            const presets = (JSON.parse(localStorage.getItem("presets")) ?? []) as ITablePreset[];
            presets.splice(presets.findIndex(p => p.id === preset.id), 1, preset);
            localStorage.setItem("presets", JSON.stringify(presets));
            return Promise.resolve();
        },
        onPresetDelete: async preset => {
            const presets = (JSON.parse(localStorage.getItem("presets")) ?? []) as ITablePreset[];
            presets.splice(presets.findIndex(p => p.id === preset.id), 1);
            localStorage.setItem("presets", JSON.stringify(presets));
            return Promise.resolve();
        },
    });

    const dataSource = useLazyDataSource({
        api,
        getId: (i) => [i.__typename, i.id] as PersonTableRecordId,
        getChildCount: (item: PersonTableRecord) => {
            return item.__typename === "PersonGroup" ? item.count : null;
        },
    }, []);

    const rowOptions: DataRowOptions<PersonTableRecord, PersonTableRecordId> = {
        checkbox: { isVisible: true },
        onClick: (rowProps: DataRowProps<PersonTableRecord, PersonTableRecordId>) => {
            if (infoPanelId === rowProps.id[1]) {
                setInfoPanelId(null);
            }
            setInfoPanelId(rowProps.id[1] as number);
        },
    };

    const renderRow = (props: DataRowProps<PersonTableRecord, PersonTableRecordId>) => {
        let columns = (props.isLoading || props.value?.__typename === "Person") ? props.columns : columnsSet.groupColumns;
        return <DataTableRow key={ props.rowKey } { ...props } size="36" columns={ columns }/>;
    };

    const personsDataView = dataSource.useView(tableStateApi.tableState, tableStateApi.onTableStateChange, {
        rowOptions,
        isFoldedByDefault: () => true,
        cascadeSelection: true,
    });

    const selectAll = useMemo(() => ({
        value: false,
        isDisabled: true,
        onValueChange: null,
    }), []);

    return (
        <div className={ css.wrapper }>
            <FilterPanel
                { ...tableStateApi }
                filters={ filters }
                columns={ columnsSet.personColumns }
                onToggle={ setIsFilterPanelOpened }
            />

            <div
                className={ css.container }
                role="table"
                aria-rowcount={ personsDataView.getListProps().rowsCount }
                aria-colcount={ columnsSet.personColumns.length }
            >
                <FlexRow
                    background="white"
                    borderBottom
                    cx={ cx(css.presets, { [css.presetsWithFilter]: isFilterPanelOpened }) }
                >
                    <Presets { ...tableStateApi }/>
                </FlexRow>

                <DataTable
                    headerTextCase="upper"
                    getRows={ personsDataView.getVisibleRows }
                    columns={ columnsSet.personColumns }
                    renderRow={ renderRow }
                    selectAll={ selectAll }
                    showColumnsConfig
                    value={ tableStateApi.tableState }
                    onValueChange={ tableStateApi.onTableStateChange }
                    allowColumnsResizing={ true }
                    { ...personsDataView.getListProps() }
                />
            </div>

            <InfoSidebarPanel
                panelId={ infoPanelId }
                data={ dataSource.getById(["Person", infoPanelId]) as Person }
                onClose={ closeInfoPanel }
            />
        </div>
    );
};