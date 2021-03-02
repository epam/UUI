import * as React from 'react';
import { PickerBase, PickerBaseProps, PickerBaseState } from './PickerBase';
import { DataTableProps, UuiContexts, uuiContextTypes, DataRowProps } from '@epam/uui';
import { i18n } from "../../i18n";

export type PickerListBaseProps<TItem, TId> = PickerBaseProps<TItem, TId> & {
    /**
     * Number of default items to show initially, when nothing is selected.
     * Default it 10 items
     */
    maxDefaultItems?: number;

    /** Maximum total number of items to show, including selected */
    maxTotalItems?: number;

    /**
     * Ids of items to show first.
     * If not specified, top props.maxDefaultItems will be shown according to the DataSource sorting settings (default is 10)
     */
    defaultIds?: TId[];

    /** If provided, top picks will be automatically adjusted based on last user selection, and stored as user setting under provided key */
    settingsKey?: string;

    sortBy?(item: TItem): string;
};

// 1. maxItems = 100, always fits => checkbox/radio group
// 2. maxItems = 5, items > 5, no topPicks => user-filter

interface PickerListState<TId> extends PickerBaseState {
    visibleIds: TId[];
}

interface LastUsedRec<TId> {
    id: TId;
    /* For possible future uses */
    sessionStartTime: number;
    selectionTime: number;
}

export abstract class PickerListBase<TItem, TId, TProps> extends PickerBase<TItem, TId, PickerListBaseProps<TItem, TId> & TProps, PickerListState<TId>> {
    static contextTypes = uuiContextTypes;
    sessionStartTime = (new Date()).getTime();
    context: UuiContexts;
    state: PickerListState<TId> = {
        dataSourceState: { focusedIndex: 0, topIndex: 0, visibleCount: this.getMaxDefaultItems() },
        visibleIds: this.getVisibleIds(),
    };

    getSettingsKey() {
        return 'loveship/PickerList/lastSelectedIds/v2/' + this.props.settingsKey;
    }

    getMaxTotalItems() {
        return this.props.maxTotalItems || 50;
    }

    getMaxDefaultItems() {
        return Math.min(this.props.maxDefaultItems || 10, this.getMaxTotalItems());
    }

    getModalTogglerCaption(totalCount: number, rowsCount: number) {
        let togglerCaption = i18n.pickerList.showAll;
        if (totalCount != null) {
            togglerCaption += ' ' + totalCount;
        }

        if (this.getEntityName()) {
            togglerCaption += ' ' + this.getEntityName().toUpperCase();
        }

        if (!this.isSingleSelect() && rowsCount > 0) {
            togglerCaption += i18n.pickerList.rowsSelected(rowsCount);
        }

        return togglerCaption;
    }

    getVisibleIds() {
        let lastUsedUds: TId[] = [];
        if (this.props.settingsKey) {
            let settings = this.context.uuiUserSettings.get(this.getSettingsKey(), [] as LastUsedRec<TId>[]);
            lastUsedUds = settings.map(r => r.id);
        }

        let visibleIds: TId[] = this.getSelectedIdsArray(this.props.value).slice(0, this.getMaxTotalItems());

        visibleIds = this.addDistinct(visibleIds, [
            ...lastUsedUds,
            ...(this.props.defaultIds || []),
        ], this.getMaxDefaultItems());

        return visibleIds;
    }

    distinct(ids: TId[]): TId[] {
        let result: TId[] = [];
        let hash: Record<string, boolean> = {};
        ids.forEach(id => {
            let key = JSON.stringify(id);
            if (!hash[key]) {
                result.push(id);
                hash[key] = true;
            }
        });
        return result;
    }

    addDistinct(to: TId[], add: TId[], maxItems: number) {
        let added: Record<string, boolean> = {};
        to.forEach(id => added[JSON.stringify(id)] = true);
        let result = [...to];
        for (let n = 0; n < add.length && (result.length < maxItems); n++) {
            let id = add[n];
            let key = JSON.stringify(id);
            if (!added[key]) {
                result.push(id);
                added[key] = true;
            }
        }
        return result;
    }

    appendLastSelected(ids: TId[]) {
        if (this.props.settingsKey) {
            let lastUsedIds = this.context.uuiUserSettings.get(this.getSettingsKey(), [] as LastUsedRec<TId>[]);
            let selectionTime = (new Date()).getTime();
            lastUsedIds = [
                ...ids.map(id => ({ id, selectionTime, sessionStartTime: this.sessionStartTime } as LastUsedRec<TId>)).reverse(),
                ...lastUsedIds,
            ].slice(0, 100);

            this.context.uuiUserSettings.set(this.getSettingsKey(), lastUsedIds);
        }
    }


    buildRowsList() {
        const maxDefaultItems = this.getMaxDefaultItems();
        const maxTotalItems = this.getMaxTotalItems();
        const view = this.getView();

        let result: DataRowProps<TItem, TId>[] = [];
        let added: Record<string, boolean> = {};

        const addRows = (rows: DataRowProps<TItem, TId>[], maxItems: number) => {
            for (let n = 0; n < rows.length && (!maxItems || result.length < maxItems); n++) {
                const row = rows[n];
                if (!added[row.rowKey]) {
                    result.push(row);
                    added[row.rowKey] = true;
                }
            }
        };

        addRows(view.getSelectedRows(), this.getMaxTotalItems());

        if (this.state.visibleIds && result.length < maxTotalItems) {
            let rows = this.state.visibleIds.map((id, n) => view.getById(id, n)).filter(r => !!r);
            addRows(rows, maxTotalItems);
        }

        if (!this.props.defaultIds && result.length < maxDefaultItems) {
            let rows = view.getVisibleRows();
            addRows(rows, maxDefaultItems);
        }

        const dataSourceState = this.getDataSourceState();

        // TBD: What if user doesn't want to sort selection? E.g. he has manually sorted Enum, or already passed ordered ids in defaultIds
        const sorting = dataSourceState.sorting && dataSourceState.sorting[0];
        const sortBy = this.props.sortBy || ((i: any) => sorting ? i[sorting.field] : this.getName(i));
        const stringComparer = (new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'})).compare;
        const comparer = (a: DataRowProps<TItem, TId>, b: DataRowProps<TItem, TId>) => {
            const loadingComparison = (b.isLoading ? 0 : 1) - (a.isLoading ? 0 : 1);
            if (loadingComparison != 0 || (a.isLoading && b.isLoading)) {
                return loadingComparison;
            } else {
                return stringComparer(sortBy(a.value, sorting), sortBy(b.value, sorting));
            }
        };
        result.sort(comparer);

        return result;
    }
}