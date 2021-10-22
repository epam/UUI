import React, { useMemo } from "react";
import css from "./DemoTable.scss";
import { DataRowProps, DataRowOptions, cx, useLazyDataSource } from "@epam/uui";
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

export const DemoTable: React.FC = () => {
    const filterPanelOptions = useFilterPanelOptions();
    const infoPanelOptions = useInfoPanelOptions();

    const filters = useMemo(getFilters, []);
    const columnsSet = useMemo(() => getColumns(filters, infoPanelOptions.openPanel), []);

    const tableStateApi = useTableState({
        columns: columnsSet.personColumns,
        initialPresets: JSON.parse(localStorage.getItem("presets")) ?? [],
        onPresetsChange: async newPresets => {
            localStorage.setItem("presets", JSON.stringify(newPresets));
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

    const personsDataView = dataSource.useView(tableStateApi.tableState, tableStateApi.onTableStateChange, {
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
                        { ...tableStateApi }
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
                    value={ tableStateApi.tableState }
                    onValueChange={ tableStateApi.onTableStateChange }
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