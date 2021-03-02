import * as React from 'react';
import { UuiContexts, uuiContextTypes, IHasPlaceholder, IDisableable, DataRowProps, ICanBeReadonly } from '@epam/uui';
import { PickerBase, PickerBaseState, PickerBaseProps, handleDataSourceKeyboard, PickerTogglerProps, DataSourceKeyboardParams } from './index';
import { DropdownState } from '../overlays';
import { Placement } from 'popper.js';
import { i18n } from "../../i18n";
import { findDOMNode } from 'react-dom';

export type PickerInputBaseProps<TItem, TId> = PickerBaseProps<TItem, TId> & IHasPlaceholder & IDisableable & ICanBeReadonly & {
    editMode?: 'dropdown' | 'modal';
    maxItems?: number;
    minBodyWidth?: number;
    isSingleLine?: boolean;
    dropdownPlacement?: Placement;
    renderToggler?: (props: PickerTogglerProps<TItem, TId>) => React.ReactNode;
    searchPosition?: 'input' | 'body' | 'none';
    disableClear?: boolean;
    minCharsToSearch?: number;
    dropdownHeight?: number;
    autoFocus?: boolean;
};

interface PickerInputState extends DropdownState, PickerBaseState {
    showSelected: boolean;
}

const initialRowsVisible = 20; /* estimated, with some reserve to allow start scrolling without fetching more data */

export abstract class PickerInputBase<TItem, TId, TProps> extends PickerBase<TItem, TId, PickerInputBaseProps<TItem, TId> & TProps, PickerInputState> {
    static contextTypes = uuiContextTypes;
    togglerRef = React.createRef<any>();
    context: UuiContexts;

    abstract toggleModalOpening(opened: boolean): void;

    static getDerivedStateFromProps(props: PickerInputBaseProps<any, any>, state: PickerInputState) {
        if (props.isDisabled && state.opened) {
            return {
                ...state,
                opened: false,
            };
        } else {
            return null;
        }
    }

    getInitialState() {
        let base = super.getInitialState();
        return {
            ...base,
            opened: false,
            dataSourceState: {
                ...base.dataSourceState,
                visibleCount: initialRowsVisible,
            },
            showSelected: false,
        };
    }

    toggleBodyOpening = (opened: boolean) => {
        if (this.props.editMode == 'modal') {
            this.toggleModalOpening(opened);
        } else {
            this.toggleDropdownOpening(opened);
        }
    }

    toggleDropdownOpening(opened: boolean) {
        this.setState({ opened, dataSourceState: { ...this.state.dataSourceState, topIndex: 0, visibleCount: initialRowsVisible, focusedIndex: 0, search: '' } });
    }


    onSelect = (row: DataRowProps<TItem, TId>) => {
        this.setState({opened: false});
        this.handleDataSourceValueChange({  ...this.state.dataSourceState, search: '', selectedId: row.id });
    }

    getSearchPosition() {
        if (!this.props.searchPosition) {
            return this.props.selectionMode === 'multi' ? 'body' : 'input';
        } else {
            return this.props.searchPosition;
        }
    }

    getPlaceholder() {
        return this.props.placeholder || i18n.pickerInput.defaultPlaceholder(this.getEntityName() ? this.getEntityName() : "");
    }

    handleClearSelection = () => {
        this.toggleDropdownOpening(false);
        this.clearSelection();
    }

    shouldShowBody() {
        const searchPosition = this.props.searchPosition || 'input';
        const opened = this.state.opened && !this.props.isDisabled;

        if (this.props.minCharsToSearch && this.props.editMode !== 'modal' && searchPosition === 'input') {
            const isEnoughSearchLength = this.state.dataSourceState.search ? this.state.dataSourceState.search.length >= this.props.minCharsToSearch : false;
            return isEnoughSearchLength && opened;
        }
        return opened;
    }

    getTogglerProps(rows: DataRowProps<TItem, TId>[]): PickerTogglerProps<TItem, TId> {
        const view = this.getView();
        let selectedRows = view.getSelectedRows();
        const { isDisabled, autoFocus, isInvalid, isReadonly, isSingleLine, maxItems, minCharsToSearch, validationMessage, validationProps } = this.props;

        return {
            isSingleLine,
            maxItems,
            minCharsToSearch,
            isInvalid,
            validationProps,
            validationMessage,
            isReadonly,
            isDisabled,
            autoFocus,
            onClear: !this.props.disableClear ? this.handleClearSelection : undefined,
            selection: selectedRows,
            placeholder: this.getPlaceholder(),
            getName: (i: any) => this.getName(i),
            entityName: this.getEntityName(selectedRows.length),
            pickerMode: this.isSingleSelect() ? 'single' : 'multi',
            onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => this.handlePickerInputKeyboard(rows, e),
            disableSearch: this.getSearchPosition() !== 'input',
            ref: this.togglerRef,
        };
    }

    handlePickerInputKeyboard = (rows: DataSourceKeyboardParams['rows'], e: React.KeyboardEvent<HTMLElement>) => {
        if (this.props.isDisabled || this.props.editMode === 'modal') return;

        if (e.key === 'Enter' && !this.state.opened) {
            return this.toggleDropdownOpening(!this.state.opened);
        }

        if (e.key === 'Escape' && this.state.opened || e.key === 'Tab' && this.state.opened) {
            e.preventDefault();
            this.toggleDropdownOpening(false);
            (findDOMNode(this.togglerRef.current) as any).focus();
        }

        handleDataSourceKeyboard({
            value: this.getDataSourceState(),
            onValueChange: this.handleDataSourceValueChange,
            listView: this.getView(),
            editMode: this.props.editMode,
            rows,
        }, e);
    }

    handleTogglerSearchChange = (value: string) => {
        this.setState({ ...this.state, dataSourceState: { ...this.state.dataSourceState, focusedIndex: -1, search: value }, opened: value.length > 0 });
    }

    getRows() {
        if (this.shouldShowBody()) {
            const view = this.getView();

            if (this.state.showSelected) {
                const topIndex = this.state.dataSourceState.topIndex;
                return view.getSelectedRows().slice(topIndex, topIndex + this.state.dataSourceState.visibleCount);
            } else {
                return view.getVisibleRows();
            }
        } else {
            return [];
        }
    }
}
