import { useContext, useMemo } from 'react';
import { DataRowProps, UuiContext } from '@epam/uui-core';
import { i18n } from '../../i18n';
import { usePicker } from './usePicker';
import { usePickerListState } from './usePickerListState';
import { UsePickerListProps } from './types';

interface LastUsedRec<TId> {
    id: TId;
    /* For possible future uses */
    sessionStartTime: number;
    selectionTime: number;
}

export function usePickerList<TItem, TId, TProps>(props: UsePickerListProps<TItem, TId, TProps>) {
    const context = useContext(UuiContext);
    const sessionStartTime = useMemo(() => new Date().getTime(), []);

    const getMaxTotalItems = () => props.maxTotalItems || 50;
    const getMaxDefaultItems = () => Math.min(props.maxDefaultItems || 10, getMaxTotalItems());
    const getSettingsKey = () =>
        'loveship/PickerList/lastSelectedIds/v2/' + props.settingsKey;

    const getSelectedIdsArray = (selected: TId | TId[] | null | undefined): TId[] => {
        if (selected) {
            if (props.selectionMode === 'single') {
                return [selected as TId];
            } else {
                return selected as TId[];
            }
        }
        return [];
    };
    const addDistinct = (to: TId[], add: TId[], maxItems: number) => {
        const added: Record<string, boolean> = {};
        to.forEach((id) => {
            added[JSON.stringify(id)] = true;
        });
        const result = [...to];
        for (let n = 0; n < add.length && result.length < maxItems; n++) {
            const id = add[n];
            const key = JSON.stringify(id);
            if (!added[key]) {
                result.push(id);
                added[key] = true;
            }
        }
        return result;
    };

    const maxDefaultItems = getMaxDefaultItems();

    const getVisibleIds = () => {
        let lastUsedUds: TId[] = [];
        if (props.settingsKey) {
            const settings = context.uuiUserSettings.get(getSettingsKey(), [] as LastUsedRec<TId>[]);
            lastUsedUds = settings.map((r) => r.id);
        }

        let visibleIds: TId[] = getSelectedIdsArray(props.value as TId | TId[]).slice(0, getMaxTotalItems());

        visibleIds = addDistinct(visibleIds, [...lastUsedUds, ...(props.defaultIds || [])], maxDefaultItems);

        return visibleIds;
    };

    const pickerListState = usePickerListState<TId>({
        dataSourceState: { visibleCount: maxDefaultItems },
        visibleIds: getVisibleIds(),
    });

    const { dataSourceState, visibleIds } = pickerListState;

    const pickerProps = { ...props, showSelectedOnly: pickerListState.showSelected };
    const picker = usePicker<TItem, TId, UsePickerListProps<TItem, TId, TProps>>(pickerProps, pickerListState);
    const {
        view,
        getEntityName,
        getPluralName,
        getDataSourceState,
        isSingleSelect,
        getName,
        getSelectedRows,
        handleDataSourceValueChange,
        getRowOptions,
    } = picker;

    const onlySelectedView = props.dataSource.useView(getDataSourceState(), handleDataSourceValueChange, {
        rowOptions: getRowOptions(),
        getSearchFields: props.getSearchFields || ((item: TItem) => [getName(item)]),
        ...(props.isFoldedByDefault ? { isFoldedByDefault: props.isFoldedByDefault } : {}),
        ...(props.sortBy ? { sortBy: props.sortBy } : {}),
        ...(props.cascadeSelection ? { cascadeSelection: props.cascadeSelection } : {}),
        ...(props.getRowOptions ? { getRowOptions: props.getRowOptions } : {}),
        backgroundReload: true,
        showSelectedOnly: true,
    }, [props.dataSource]);

    const getEntityNameForToggler = () => props.entityPluralName || getPluralName();

    const getModalTogglerCaption = (totalCount: number, rowsCount: number) => {
        let togglerCaption = i18n.pickerList.showAll;
        if (totalCount != null) {
            togglerCaption += ' ' + totalCount;
        }

        if (getEntityNameForToggler()) {
            togglerCaption += ' ' + getEntityNameForToggler().toUpperCase();
        }

        if (!isSingleSelect() && rowsCount > 0) {
            togglerCaption += i18n.pickerList.rowsSelected(rowsCount);
        }

        return togglerCaption;
    };

    const appendLastSelected = (ids: TId[]) => {
        if (props.settingsKey) {
            let lastUsedIds = context.uuiUserSettings.get(getSettingsKey(), [] as LastUsedRec<TId>[]);
            const selectionTime = new Date().getTime();
            lastUsedIds = [...ids.map((id) => ({ id, selectionTime, sessionStartTime: sessionStartTime } as LastUsedRec<TId>)).reverse(), ...lastUsedIds].slice(
                0,
                100,
            );
            context.uuiUserSettings.set(getSettingsKey(), lastUsedIds);
        }
    };

    const sortRows = (rows: DataRowProps<TItem, TId>[]) => {
        const dsState = getDataSourceState();
        const sorting = dsState.sorting?.[0];

        if (!sorting || (!props.sortBy && !sorting.field)) {
            return rows;
        }

        const sortBy = props.sortBy || ((i: TItem) => i[sorting.field as keyof TItem]);
        const sign = sorting.direction === 'desc' ? -1 : 1;
        const stringComparer = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare;
        const comparer = (a: DataRowProps<TItem, TId>, b: DataRowProps<TItem, TId>) => {
            const aIsLoading = (a.isLoading || a.isUnknown);
            const bIsLoading = (b.isLoading || b.isUnknown);
            const loadingComparison = (bIsLoading ? 0 : 1) - (aIsLoading ? 0 : 1);
            if ((loadingComparison && loadingComparison !== 0) || (aIsLoading && bIsLoading)) {
                return loadingComparison;
            } else {
                return sign * stringComparer(sortBy(a.value, sorting), sortBy(b.value, sorting));
            }
        };

        return [...rows].sort(comparer);
    };

    const buildRowsList = () => {
        const maxTotalItems = getMaxTotalItems();

        const result: DataRowProps<TItem, TId>[] = [];
        const added: Record<string, boolean> = {};

        const addRows = (rows: DataRowProps<TItem, TId>[], maxItems: number) => {
            for (let n = 0; n < rows.length && (!maxItems || result.length < maxItems); n++) {
                const row = rows[n];
                if (!added[row.rowKey]) {
                    result.push(row);
                    added[row.rowKey] = true;
                }
            }
        };
        addRows(getSelectedRows(maxTotalItems), maxTotalItems);
        if (visibleIds?.length && result.length < maxTotalItems) {
            const rows = visibleIds.map((id, n) => view.getById(id, n));
            addRows(rows, maxTotalItems);
        }

        if (!props.defaultIds && result.length < maxDefaultItems) {
            const rows = view.getVisibleRows();
            addRows(rows, maxDefaultItems);
        }
        return sortRows(result);
    };

    return {
        context,
        dataSourceState,
        getName,
        getEntityName,
        appendLastSelected,
        getSelectedIdsArray,
        view,
        onlySelectedView,
        buildRowsList,
        getMaxDefaultItems,
        getModalTogglerCaption,
    };
}
