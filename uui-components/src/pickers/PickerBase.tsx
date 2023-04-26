import React from 'react';
import {
    DataSourceState, DataRowOptions, Lens, IDataSourceView, DataSourceListProps, PickerBaseProps, PickerFooterProps, UuiContexts,
} from '@epam/uui-core';
import { dataSourceStateToValue, applyValueToDataSourceState } from './bindingHelpers';
import isEqual from 'lodash.isequal';

export interface PickerBaseState {
    dataSourceState: DataSourceState;
    showSelected?: boolean;
}

export abstract class PickerBase<TItem, TId, TProps extends PickerBaseProps<TItem, TId>, TState extends PickerBaseState> extends React.Component<TProps, TState> {
    public context: UuiContexts;
    state: TState = this.getInitialState();
    lens = Lens.onState<PickerBaseState>(this);
    componentWillUnmount(): void {
        this.props.dataSource.unsubscribeView(this.handleDataSourceValueChange);
    }

    protected getInitialState(): TState {
        return { dataSourceState: { focusedIndex: 0, topIndex: 0, visibleCount: 20 } } as any;
    }

    componentDidUpdate(prevProps: Readonly<TProps>, prevState: Readonly<TState>): void {
        const { search } = this.state.dataSourceState;
        const isSearchingStarted = !prevState.dataSourceState.search && search;
        const isSwitchIsBeingTurnedOn = !prevState.showSelected && this.state.showSelected;
        if (isSearchingStarted && prevState.showSelected) {
            this.setState((state) => ({ ...state, showSelected: false }));
        }
        if (search && isSwitchIsBeingTurnedOn) {
            this.setState((state) => ({ ...state, dataSourceState: { ...state.dataSourceState, search: '' } }));
        }
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
    };

    getPluralName = () => {
        const { entityName } = this.props;
        if (!entityName) return;
        if (entityName.endsWith('s')) return entityName.concat('es');
        if (entityName.endsWith('y')) return entityName.concat('(s)');
        return entityName.concat('s');
    };

    getEntityName = (countSelected?: number) => {
        const { entityName, entityPluralName, selectionMode } = this.props;
        if ((!entityName && !entityPluralName) || (!entityName && countSelected === 1)) return '';
        if ((countSelected <= 1 && entityName) || selectionMode === 'single') return entityName;
        return entityPluralName || this.getPluralName();
    };

    isSingleSelect = () => {
        return this.props.selectionMode == 'single';
    };

    getSelectedIdsArray = (value: any): TId[] => {
        if (value) {
            if (this.isSingleSelect()) {
                return [value];
            } else {
                return value;
            }
        }
        return [];
    };

    getValueFromState = (state: DataSourceState) => {
        if (this.isSingleSelect()) {
            return state.selectedId;
        } else {
            return state.checked;
        }
    };

    protected handleSelectionValueChange = (newValue: any) => {
        this.props.onValueChange(newValue);

        if (this.props.getValueChangeAnalyticsEvent) {
            const event = this.props.getValueChangeAnalyticsEvent(newValue, this.props.value);
            this.context.uuiAnalytics.sendEvent(event);
        }
    };

    protected handleDataSourceValueChange = (newDataSourceState: DataSourceState) => {
        let showSelected = this.state.showSelected;

        if (showSelected && newDataSourceState.checked?.length == 0) {
            showSelected = false;
        }

        this.setState((s) => ({ ...s, showSelected, dataSourceState: newDataSourceState }));
        const newValue = dataSourceStateToValue(this.props, newDataSourceState, this.props.dataSource);

        if (!isEqual(this.props.value, newValue)) {
            this.handleSelectionValueChange(newValue);
        }
    };

    getDataSourceState = () => {
        return applyValueToDataSourceState(this.props, this.state.dataSourceState, this.props.value, this.props.dataSource);
    };

    getRowOptions = (item: TItem, index: number) => {
        const options: DataRowOptions<TItem, TId> = {};
        if (this.isSingleSelect()) {
            options.isSelectable = true;
        } else {
            options.checkbox = { isVisible: true };
        }

        const externalOptions = this.props.getRowOptions ? this.props.getRowOptions(item, index) : {};

        return { ...options, ...externalOptions };
    };

    clearSelection = () => {
        this.handleDataSourceValueChange({
            ...this.state.dataSourceState,
            selectedId: this.props.emptyValue,
            checked: [],
        });
    };

    hasSelection() {
        if (Array.isArray(this.props.value)) {
            return this.props.value.length !== 0;
        } else {
            return this.props.value !== undefined && this.props.value !== null;
        }
    }

    getSelectedRows(visibleCount?: number) {
        if (this.hasSelection()) {
            const view = this.getView();
            return view.getSelectedRows({ visibleCount });
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
            getSearchFields: this.props.getSearchFields || ((item: TItem) => [this.getName(item)]),
            isFoldedByDefault: this.props.isFoldedByDefault,
            ...(this.props.sortBy ? { sortBy: this.props.sortBy } : {}),
            ...(this.props.cascadeSelection ? { cascadeSelection: this.props.cascadeSelection } : {}),
        });
    }

    private onShowSelectedChange = (nV: boolean) => {
        this.setState({
            showSelected: nV,
            dataSourceState: { ...this.state.dataSourceState },
        });
    };

    getFooterProps(): PickerFooterProps<TItem, TId> {
        return {
            view: this.getView(),
            showSelected: {
                value: this.state.showSelected,
                onValueChange: this.onShowSelectedChange,
            },
            clearSelection: this.clearSelection,
            selectionMode: this.props.selectionMode,
        };
    }
}
