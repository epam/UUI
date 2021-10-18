import React, { useCallback, useEffect, useMemo, useState } from "react";
import css from "./DemoTable.scss";
import { DataRowProps, DataRowOptions, cx, getColumnsConfig, DataTableState, useLazyDataSource } from "@epam/uui";
import { Person, PersonGroup } from "@epam/uui-docs";
import { FlexRow, DataTable, DataTableRow, IconButton } from "@epam/promo";
import filterIcon from "@epam/assets/icons/common/content-filter_list-24.svg";

import { getFilters, api } from "./data";
import { getColumns } from "./columns";
import { PersonTableRecord, PersonTableRecordId } from "./types";
import { useFilterPanelOptions, useInfoPanelOptions, useTableState } from "./hooks";
import { FilterPanel } from "./FilterPanel";
import { InfoSidebarPanel } from "./InfoSidebarPanel";
import { Presets } from "./Presets";
import { normalizeFilter } from "./helpers";

export const DemoTable: React.FC = () => {
    const filterPanelOptions = useFilterPanelOptions();
    const infoPanelOptions = useInfoPanelOptions();

    const filters = useMemo(getFilters, []);
    const columnsSet = useMemo(() => getColumns(filters, infoPanelOptions.openPanel), []);

    const tableStateApi = useTableState({
        columns: columnsSet.personColumns,
        columnsConfig: getColumnsConfig(columnsSet.personColumns, {}),
        loadPresets: () => JSON.parse(localStorage.getItem("presets")) ?? [],
        onPresetsSave: newPresets => localStorage.setItem("presets", JSON.stringify(newPresets)),
    });

    const [value, setValue] = useState<DataTableState>({
        topIndex: 0,
        visibleCount: 40,
        sorting: [{ field: "name" }],
        filter: tableStateApi.filter,
        columnsConfig: tableStateApi.columnsConfig,
    });

    useEffect(() => {
        setValue(prevValue => ({
            ...prevValue,
            filter: tableStateApi.filter,
            columnsConfig: tableStateApi.columnsConfig,
        }));
    }, [tableStateApi.filter, tableStateApi.columnsConfig]);

    const onValueChange = useCallback((newValue: DataTableState) => {
        tableStateApi.onFilterChange(newValue.filter);
        tableStateApi.onColumnsConfigChange(newValue.columnsConfig);
        setValue({
            ...newValue,
            filter: normalizeFilter(newValue.filter),
        });
    }, []);

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
            if (infoPanelOptions.panelId === rowProps.id[1]) {
                infoPanelOptions.closePanel();
            }
            infoPanelOptions.openPanel(rowProps.id[1]);
        },
    };

    const renderRow = (props: DataRowProps<PersonTableRecord, PersonTableRecordId>) => {
        let columns = (props.isLoading || props.value?.__typename === "Person") ? props.columns : columnsSet.groupColumns;
        return <DataTableRow key={ props.rowKey } { ...props } size="36" columns={ columns }/>;
    };

    const personsDataView = dataSource.useView(value, onValueChange, {
        rowOptions,
        isFoldedByDefault: () => true,
        cascadeSelection: true,
    });
    
    const renderInfoSidebarPanel = () => {
        const data = dataSource.getById(["Person", infoPanelOptions.panelId]) as Person;
        return <InfoSidebarPanel data={ data } onClose={ infoPanelOptions.closePanel }/>;
    };
    
    const selectAll = useMemo(() => ({
        value: false,
        isDisabled: true, 
        onValueChange: null,
    }), []);

    return (
        <FlexRow cx={ css.wrapper } alignItems="top">
            { filterPanelOptions.isPanelOpened && (
                <div className={ cx(css.filterSidebarPanelWrapper, filterPanelOptions.panelStyleModifier) }>
                    <FilterPanel
                        tableStateApi={ tableStateApi }
                        filters={ filters }
                        columns={ columnsSet.personColumns }
                        close={ filterPanelOptions.closePanel }
                    />
                </div>
            ) }
            <div
                className={ css.container }
                role="table"
                aria-rowcount={ personsDataView.getListProps().rowsCount }
                aria-colcount={ columnsSet.personColumns.length }
            >
                <FlexRow background="white" borderBottom>
                    { filterPanelOptions.isButtonVisible && (
                        <div className={ css.iconContainer }>
                            <IconButton
                                icon={ filterIcon }
                                color="gray50"
                                cx={ [css.icon] }
                                onClick={ filterPanelOptions.openPanel }
                            />
                        </div>
                    ) }
                    <Presets { ...tableStateApi }/>
                </FlexRow>
                <DataTable
                    headerTextCase="upper"
                    getRows={ personsDataView.getVisibleRows }
                    columns={ columnsSet.personColumns }
                    renderRow={ renderRow }
                    selectAll={ selectAll }
                    showColumnsConfig
                    value={ value }
                    onValueChange={ onValueChange }
                    allowColumnsResizing={ true }
                    { ...personsDataView.getListProps() }
                />
            </div>
            { infoPanelOptions.panelId && (
                <div className={ cx(css.infoSidebarPanelWrapper, infoPanelOptions.isPanelOpened ? "show" : "hide") }>
                    { renderInfoSidebarPanel() }
                </div>
            ) }
        </FlexRow>
    );
};