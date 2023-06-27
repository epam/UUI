import React from 'react';
import {
    DataSourceState, Lens, IDataSourceView, DataSourceListProps, PickerBaseProps, PickerFooterProps, UuiContexts,
} from '@epam/uui-core';
import { dataSourceStateToValue, applyValueToDataSourceState } from './bindingHelpers';
import isEqual from 'lodash.isequal';
import { Text } from '../Text';
import css from './PickerBase.module.scss';

export interface PickerBaseState {
    dataSourceState: DataSourceState;
    showSelected?: boolean;
}

interface Range {
    from: number;
    to: number;
    isHighlighted: boolean;
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

    getName = (i: (TItem & { name?: string }) | void) => {
        const unknownStr = 'Unknown';
        if (this.props.getName) {
            try {
                return this.props.getName(i as TItem);
            } catch (e) {
                return unknownStr;
            }
        }
        return i ? i.name : unknownStr;
    };
    
    protected highlightSearchMatches = (str: string) => {
        const { search } = this.state.dataSourceState ?? {};
        if (!search) {
            return str;
        }

        const ranges = this.getRanges(search, str);
        if (!ranges.length) {
            return str;
        }

        return this.getDecoratedText(str, ranges);
    };

    private getDecoratedText = (str: string, ranges: Range[]) => {
        const textChunks = ranges.map((range, index) => {
            const rangeStr = str.substring(range.from, range.to);
            if (range.isHighlighted) {
                return this.getHighlightedText(rangeStr, index);
            }
            return this.getRegularText(rangeStr, index);
        });
    
        return <Text>{textChunks}</Text>;
    };

    private getHighlightedText = (str: string, index: number) => {
        return <span key={ `${str}-${index}` } className={ css.highlightedText }>{str}</span>;
    };

    private getRegularText = (str: string, index: number) => {
        return <span key={ `${str}-${index}` }>{str}</span>;
    };

    private mergeRanges = (ranges: Range[]) => {
        const mergedRanges: Range[] = [];
        ranges.forEach((range) => {
            if (!mergedRanges.length) {
                mergedRanges.push({ ...range, isHighlighted: true });
            }
              
            const lastRange = mergedRanges[mergedRanges.length - 1];
            if (range.from >= lastRange.from && range.from <= lastRange.to + 1 && range.to > lastRange.to) {
                lastRange.to = range.to;
            }
        
            if (lastRange.to < range.from - 1) {
                mergedRanges.push({ ...range, isHighlighted: true });
            }
        });

        return mergedRanges;
    };

    private addNotHighlightedRanges = (ranges: Range[], str: string) => {
        const allRanges: Range[] = [];
        ranges.forEach((range, index) => {
            if (index === 0 && range.from !== 0) {
                allRanges.push({ from: 0, to: range.from, isHighlighted: false });
            }
            const prevRange = ranges[index - 1];
            if (prevRange && prevRange.to + 1 < range.from) {
                allRanges.push({ from: prevRange.to, to: range.from, isHighlighted: false });
            }
        
            allRanges.push(range);
            const lastIndex = ranges.length - 1;
            if (index === lastIndex && range.to < str.length) {
                allRanges.push({ from: range.to, to: str.length, isHighlighted: false });
            }
        });
        return allRanges;
    };

    private getRanges = (search: string, str: string) => {
        const words = search
            .split(' ')
            .flatMap((s) => s.split(','))
            .filter(Boolean)
            .map((word) => new RegExp(word, 'ig'));
        const matches = words.flatMap((word) => [...str.matchAll(word)]);

        const ranges = matches
            .map((match) => ({ from: match.index, to: match[0].length + match.index, isHighlighted: true }))
            .sort((range1, range2) => range1.from - range2.from);

        if (!ranges) {
            return [];
        }

        const mergedRanges = this.mergeRanges(ranges);
        return this.addNotHighlightedRanges(mergedRanges, str);
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
        return this.props.selectionMode === 'single';
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

        if (showSelected && !newDataSourceState.checked?.length) {
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

    getRowOptions = () => {
        if (this.isSingleSelect()) {
            return { isSelectable: true };
        }

        return { checkbox: { isVisible: true } };
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
            const checked = this.getDataSourceState().checked;
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
            rowOptions: this.getRowOptions(),
            getSearchFields: this.props.getSearchFields || ((item: TItem) => [this.getName(item)]),
            isFoldedByDefault: this.props.isFoldedByDefault,
            ...(this.props.sortBy ? { sortBy: this.props.sortBy } : {}),
            ...(this.props.cascadeSelection ? { cascadeSelection: this.props.cascadeSelection } : {}),
            ...(this.props.getRowOptions ? { getRowOptions: this.props.getRowOptions } : {}),
        });
    }

    private onShowSelectedChange = (nV: boolean) => {
        this.setState((state) => ({
            showSelected: nV,
            dataSourceState: { ...state.dataSourceState },
        }));
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
