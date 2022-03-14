import * as React from 'react';
import {
    DataSourceState, DataRowOptions, DataRowProps, Lens, IDataSourceView, SortingOption, IDataSource,
    IEditable, IAnalyticableOnChange, DataSourceListProps,
} from '@epam/uui-core';
import { PickerBindingProps } from './bindingHelpers';
import { dataSourceStateToValue, applyValueToDataSourceState } from './bindingHelpers';
import isEqual from 'lodash.isequal';

export type PickerBaseOptions<TItem, TId> = {
    entityName?: string;
    entityPluralName?: string;
    dataSource: IDataSource<TItem, TId, any>;
    getName?: (item: TItem) => string;
    renderRow?: (props: DataRowProps<TItem, TId>) => React.ReactNode;
    getRowOptions?: (item: TItem, index: number) => DataRowOptions<TItem, TId>;
    renderNotFound?: (props: { search: string, onClose: () => void }) => React.ReactNode;
    emptyValue?: undefined | null | [];
    sortBy?(item: TItem, sorting: SortingOption): any;
    filter?: any;
    sorting?: SortingOption;
    cascadeSelection?: boolean;
    isFoldedByDefault?(item: TItem): boolean;
    getSearchFields?(item: TItem): string[];
    renderFooter?: (props: PickerFooterProps<TItem, TId>) => React.ReactNode;
};

export type PickerFooterProps<TItem, TId> = {
    view: IDataSourceView<TItem, TId, any>;
    showSelected: IEditable<boolean>;
    clearSelection: () => void;
};

export type PickerBaseProps<TItem, TId> = PickerBaseOptions<TItem, TId> & PickerBindingProps<TItem, TId> & IAnalyticableOnChange<any>;

export interface PickerBaseState {
    dataSourceState: DataSourceState;
    showSelected?: boolean;
}

export abstract class PickerBase<TItem, TId, TProps extends PickerBaseProps<TItem, TId>, TState extends PickerBaseState> extends React.Component<TProps, TState> {
    state: TState = this.getInitialState();
    lens = Lens.onState<PickerBaseState>(this);

    componentWillUnmount(): void {
        this.props.dataSource.unsubscribeView(this.handleDataSourceValueChange);
    }

    protected getInitialState(): TState {
        return { dataSourceState: { focusedIndex: 0, topIndex: 0, visibleCount: 20 } } as any;
    }

    componentDidUpdate(prevProps: Readonly<TProps>, prevState: Readonly<TState>): void {
        if (this.props.dataSource !== prevProps.dataSource) {
            prevProps.dataSource.unsubscribeView(this.handleDataSourceValueChange);
        }
    }

    getName = (i: TItem & { name?: string }) => {
        if (i == null) {
            return '';
        } else if (this.props.getName) {
            return this.props.getName(i);
        } else {
            return i.name;
        }
    }

    getPluralName = () => {
        const { entityName } = this.props;
        if (!entityName) return;
        if (entityName.endsWith('s')) return entityName.concat('es');
        if (entityName.endsWith('y')) return entityName.concat('(s)');
        return entityName.concat('s');
    }

    getEntityName = (countSelected?: number) => {
        const { entityName, entityPluralName, selectionMode } = this.props;
        if (!entityName && !entityPluralName || (!entityName && countSelected === 1)) return '';
        if (countSelected <= 1 && entityName || selectionMode === 'single') return entityName;
        return entityPluralName || this.getPluralName();
    }

    isSingleSelect = () => {
        return this.props.selectionMode == 'single';
    }

    getSelectedIdsArray = (value: any): TId[] => {
        if (value) {
            if (this.isSingleSelect()) {
                return [value];
            } else {
                return value;
            }
        }
        return [];
    }

    getValueFromState = (state: DataSourceState) => {
        if (this.isSingleSelect()) {
            return state.selectedId;
        } else {
            return state.checked;
        }
    }

    protected handleSelectionValueChange = (newValue: any) => {
        this.props.onValueChange(newValue);

        if (this.props.getValueChangeAnalyticsEvent) {
            const event = this.props.getValueChangeAnalyticsEvent(newValue, this.props.value);
            this.context.uuiAnalytics.sendEvent(event);
        }
    }

    protected handleDataSourceValueChange = (newDataSourceState: DataSourceState) => {
        let showSelected = this.state.showSelected;

        if (showSelected && newDataSourceState.checked?.length == 0) {
            showSelected = false;
        }

        this.setState(s => ({ ...s, showSelected, dataSourceState: newDataSourceState }));
        let newValue = dataSourceStateToValue(this.props, newDataSourceState, this.props.dataSource);

        if (!isEqual(this.props.value, newValue)) {
            this.handleSelectionValueChange(newValue);
        }
    }

    getDataSourceState = () => {
        return applyValueToDataSourceState(this.props, this.state.dataSourceState, this.props.value, this.props.dataSource);
    }

    getRowOptions = (item: TItem, index: number) => {
        let options: DataRowOptions<TItem, TId> = {};
        if (this.isSingleSelect()) {
            options.isSelectable = true;
        } else {
            options.checkbox = { isVisible: true };
        }

        const externalOptions = this.props.getRowOptions ? this.props.getRowOptions(item, index) : {};

        return { ...options, ...externalOptions };
    }

    clearSelection = () => {
        this.handleDataSourceValueChange({
            ...this.state.dataSourceState,
            selectedId: null,
            checked: [],
        });
    }

    hasSelection() {
        if (Array.isArray(this.props.value)) {
            return this.props.value.length !== 0;
        } else {
            return this.props.value !== undefined && this.props.value !== null;
        }
    }

    getSelectedRows() {
        if (this.hasSelection()) {
            const view = this.getView();
            return view.getSelectedRows();
        }
        return [];
    }

    getListProps(): DataSourceListProps {
        const view = this.getView();
        const listProps = view.getListProps();
        if (this.state.showSelected) {
            const checked = this.state.dataSourceState.checked;
            const checkedCount = checked ? checked.length : 0;
            return {
                ...listProps,
                rowsCount: checkedCount,
                knownRowsCount: checkedCount,
                exactRowsCount: checkedCount,
            };
        } else {
            return listProps;
        }
    }

    getView(): IDataSourceView<TItem, TId, any> {
        return this.props.dataSource.getView(this.getDataSourceState(), this.handleDataSourceValueChange, {
            getRowOptions: this.getRowOptions,
            cascadeSelection: this.props.cascadeSelection,
            getSearchFields: this.props.getSearchFields || ((item: TItem) => [this.getName(item)]),
            sortBy: this.props.sortBy,
            isFoldedByDefault: this.props.isFoldedByDefault,
        });
    }

    getFooterProps = (): PickerFooterProps<TItem, TId> => {
        return {
            view: this.getView(),
            showSelected: {
                value: this.state.showSelected,
                onValueChange: (nV: boolean) => this.setState({
                    showSelected: nV,
                    dataSourceState: { ...this.state.dataSourceState },
                }),
            },
            clearSelection: this.clearSelection,
        };
    }
}
