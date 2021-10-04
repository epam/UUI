import React, { useEffect, useMemo, useState } from "react";
import css from './DemoTable.scss';
import { LazyDataSource, DataRowProps, DataRowOptions, cx, getColumnsConfig } from '@epam/uui';
import { Person, PersonGroup } from '@epam/uui-docs';
import { FlexRow, DataTable, DataTableRow, IconButton } from '@epam/promo';
import filterIcon from "@epam/assets/icons/common/content-filter_list-24.svg";

import { getFilters, api } from "./data";
import { getColumns } from "./columns";
import { PersonTableRecord, PersonTableRecordId } from './types';
import { useFilterPanelOptions, useInfoPanelOptions, useTableState } from "./hooks";
import { FilterPanel } from "./FilterPanel";
import { InfoSidebarPanel } from './InfoSidebarPanel';
import { Presets } from "./Presets";

export const DemoTable: React.FC = () => {
    const filterPanelOptions = useFilterPanelOptions();
    const infoPanelOptions = useInfoPanelOptions();

    const filters = useMemo(getFilters, []);
    const columnsSet = useMemo(() => getColumns(filters, infoPanelOptions.openPanel), []);

    const { value, onValueChange } = useTableState({
        value: {
            topIndex: 0,
            visibleCount: 40,
            sorting: [{ field: 'name' }],
            isFolded: true,
            columnsConfig: getColumnsConfig(columnsSet.personColumns, {}),
        },
        loadPresets: () => JSON.parse(localStorage.getItem("presets")) ?? [],
        onPresetsSave: newPresets => localStorage.setItem("presets", JSON.stringify(newPresets)),
    });

    const dataSource = useMemo(() => new LazyDataSource({
        api,
        getId: (i) => [i.__typename, i.id] as PersonTableRecordId,
        getChildCount: (item: PersonTableRecord) =>
            item.__typename === 'PersonGroup' ? item.count : null,
    }), []);

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
        let columns = (props.isLoading || props.value?.__typename === 'Person') ? props.columns : columnsSet.groupColumns;
        return <DataTableRow key={ props.rowKey } { ...props } size="36" columns={ columns }/>;
    };

    const personsDataView = dataSource.useView(value, onValueChange as any, {
        rowOptions,
        isFoldedByDefault: () => value.isFolded,
        cascadeSelection: true,
    });

    const renderInfoSidebarPanel = () => {
        const data = dataSource.getById(['Person', infoPanelOptions.panelId]) as Person;
        return <InfoSidebarPanel data={ data } onClose={ infoPanelOptions.closePanel }/>;
    };

    return (
        <FlexRow cx={ css.wrapper } alignItems="top">
            { filterPanelOptions.isPanelOpened && (
                <div className={ cx(css.filterSidebarPanelWrapper, filterPanelOptions.panelStyleModifier) }>
                    <FilterPanel
                        filters={ filters }
                        value={ value }
                        onValueChange={ onValueChange }
                        columns={ columnsSet.personColumns }
                        close={ filterPanelOptions.closePanel }
                    />
                </div>
            ) }
            <div className={ css.container } role="table" aria-rowcount={ personsDataView.getListProps().rowsCount } aria-colcount={ columnsSet.personColumns.length }>
                <FlexRow background='white' borderBottom>
                    { isFilterButtonVisible && (
            <div className={ css.container }>
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
                    <Presets
                        value={ value }
                        onValueChange={ onValueChange }
                        columns={ columnsSet.personColumns }
                    />
                </FlexRow>
                <DataTable
                    headerTextCase="upper"
                    getRows={ personsDataView.getVisibleRows }
                    columns={ columnsSet.personColumns }
                    renderRow={ renderRow }
                    selectAll={ { value: false, isDisabled: true, onValueChange: null } }
                    showColumnsConfig
                    value={ value }
                    onValueChange={ onValueChange }
                    allowColumnsResizing={ true }
                    { ...personsDataView.getListProps() }
                />
            </div>
            { infoPanelOptions.panelId && (
                <div className={ cx(css.infoSidebarPanelWrapper, infoPanelOptions.isPanelOpened ? 'show' : 'hide') }>
                    { renderInfoSidebarPanel() }
                </div>
            ) }
        </FlexRow>
    );
};