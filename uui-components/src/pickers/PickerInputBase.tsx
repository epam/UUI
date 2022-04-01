import * as React from 'react';
import { Placement } from '@popperjs/core';
import { Modifier } from 'react-popper';
import {
    UuiContexts, UuiContext, IHasPlaceholder, IDisableable, DataRowProps, ICanBeReadonly, isMobile, mobilePopperModifier,
    IDropdownToggler, DataSourceListProps, IHasIcon, IHasRawProps, PickerBaseProps, DataSourceItemId
} from '@epam/uui-core';
import { PickerBase, PickerBaseState, handleDataSourceKeyboard, PickerTogglerProps, DataSourceKeyboardParams, PickerBodyBaseProps } from './index';
import { Dropdown, DropdownBodyProps, DropdownState } from '../overlays';
import { i18n } from '../../i18n';

export type PickerInputBaseProps<TItem, TId extends DataSourceItemId> = PickerBaseProps<TItem, TId> & IHasPlaceholder & IDisableable & ICanBeReadonly & IHasIcon & {
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
    onFocus?: (e?: React.SyntheticEvent<HTMLElement>) => void;
    onBlur?: (e: React.SyntheticEvent<HTMLElement>) => void;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    rawProps?: {
        input?: IHasRawProps<HTMLDivElement>['rawProps'];
        body?: IHasRawProps<HTMLDivElement>['rawProps'];
    }
};

interface PickerInputState extends DropdownState, PickerBaseState {
    showSelected: boolean;
}

const initialRowsVisible = 20; /* estimated, with some reserve to allow start scrolling without fetching more data */

export abstract class PickerInputBase<TItem, TId extends DataSourceItemId, TProps> extends PickerBase<TItem, TId, PickerInputBaseProps<TItem, TId> & TProps, PickerInputState> {
    static contextType = UuiContext;
    togglerRef = React.createRef<HTMLElement>();
    context: UuiContexts;

    private readonly popperModifiers: Modifier<any>[] = [
        {
            name: 'offset',
            options: { offset: [0, 6] },
        },
        mobilePopperModifier,
    ];

    abstract toggleModalOpening(opened: boolean): void;
    abstract renderTarget(targetProps: IDropdownToggler & PickerTogglerProps<TItem, TId>): React.ReactNode;
    abstract renderBody(props: DropdownBodyProps & DataSourceListProps & Partial<PickerBodyBaseProps>, rows: DataRowProps<TItem, TId>[]): React.ReactNode;

    static getDerivedStateFromProps<TItem, TId extends DataSourceItemId>(props: PickerInputBaseProps<TItem, TId>, state: PickerInputState) {
        if (props.isDisabled && state.opened) {
            return {
                ...state,
                opened: false,
            };
        } else return null;
    }

    componentDidUpdate = (prevProps: PickerInputBaseProps<TItem, TId>, prevState: PickerInputState) => {
        const { search } = this.state.dataSourceState;
        const isSearchingStarted = !prevState.dataSourceState.search && search;
        const isSwitchIsBeingTurnedOn = !prevState.showSelected && this.state.showSelected;
        if (isSearchingStarted && prevState.showSelected) {
            this.setState({ showSelected: false });
        }
        if (search && isSwitchIsBeingTurnedOn) {
            this.handleTogglerSearchChange('');
        }
    }

    getInitialState() {
        const base = super.getInitialState();
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
        if (this.state.opened === opened) return;

        if (this.props.editMode == 'modal') {
            this.toggleModalOpening(opened);
        } else {
            this.toggleDropdownOpening(opened);
        }
    }

    toggleDropdownOpening = (opened: boolean) => {
        if (isMobile()) {
            document.body.style.overflow = opened ? 'hidden' : '';
        }

        this.setState({
            opened,
            dataSourceState: {
                ...this.state.dataSourceState,
                topIndex: 0,
                visibleCount: initialRowsVisible,
                focusedIndex: 0,
                search: '',
            },
        });
    }

    onFocus = (e: React.FocusEvent<HTMLElement>) => {
        this.props.onFocus?.(e);
    }

    onBlur = (e: React.FocusEvent<HTMLElement>) => {
        this.props.onBlur?.(e);
    }

    onSelect = (row: DataRowProps<TItem, TId>) => {
        this.toggleDropdownOpening(false);
        this.handleDataSourceValueChange({ ...this.state.dataSourceState, search: '', selectedId: row.id });
        this.togglerRef.current?.focus();
    }

    getSearchPosition() {
        if (isMobile() && this.props.searchPosition !== 'none') return "body";
        if (!this.props.searchPosition) {
            return this.props.selectionMode === 'multi' ? 'body' : 'input';
        } else {
            return this.props.searchPosition;
        }
    }

    getPlaceholder() {
        return this.props.placeholder || i18n.pickerInput.defaultPlaceholder(this.getEntityName());
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

    getPickerBodyProps(rows: DataRowProps<TItem, TId>[]): Omit<PickerBodyBaseProps, 'rows'> {
        return {
            value: this.getDataSourceState(),
            onValueChange: this.handleDataSourceValueChange,
            search: this.lens.prop('dataSourceState').prop('search').toProps(),
            showSearch: this.getSearchPosition() === 'body',
            rawProps: {
                'aria-multiselectable': this.props.selectionMode === 'multi' ? true : null,
                'aria-orientation': 'vertical',
                ...this.props.rawProps?.body,
            },
            renderNotFound: this.props.renderNotFound && (() => this.props.renderNotFound({
                search: this.state.dataSourceState.search,
                onClose: () => this.toggleBodyOpening(false),
            })),
            onKeyDown: e => this.handlePickerInputKeyboard(rows, e),
        };
    }

    getTogglerProps(rows: DataRowProps<TItem, TId>[]): PickerTogglerProps<TItem, TId> {
        const selectedRows = this.getSelectedRows();
        const {
            isDisabled, autoFocus, isInvalid, isReadonly, isSingleLine, maxItems, minCharsToSearch,
            validationMessage, validationProps, disableClear: propDisableClear, icon, iconPosition, prefix, suffix,
        } = this.props;
        const searchPosition = this.getSearchPosition();
        const forcedDisabledClear = Boolean(searchPosition === 'body' && !selectedRows.length);
        const disableClear = forcedDisabledClear || propDisableClear;

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
            icon,
            iconPosition,
            prefix,
            suffix,
            onFocus: this.onFocus,
            onBlur: this.onBlur,
            onClear: this.handleClearSelection,
            selection: selectedRows,
            placeholder: this.getPlaceholder(),
            getName: (i: any) => this.getName(i),
            entityName: this.getEntityName(selectedRows.length),
            pickerMode: this.isSingleSelect() ? 'single' : 'multi',
            searchPosition: this.props.searchPosition,
            onKeyDown: e => this.handlePickerInputKeyboard(rows, e),
            disableSearch: searchPosition !== 'input',
            disableClear: disableClear,
            toggleDropdownOpening: this.toggleDropdownOpening,
            rawProps: this.props.rawProps?.input,
        };
    }

    getTargetRef(props: IDropdownToggler & PickerTogglerProps<TItem, TId>) {
        return {
            ref: (node: HTMLElement) => {
                (this.togglerRef as React.MutableRefObject<HTMLElement>).current = node;
                (props.ref as React.RefCallback<HTMLElement>)(node);
            },
        };
    }

    handlePickerInputKeyboard = (rows: DataSourceKeyboardParams['rows'], e: React.KeyboardEvent<HTMLElement>) => {
        if (this.props.isDisabled || this.props.isReadonly || this.props.editMode === 'modal') return;

        if (e.key === 'Enter' && !this.state.opened) {
            return this.toggleDropdownOpening(true);
        }

        if (e.key === 'Escape' && this.state.opened) {
            e.preventDefault();
            this.toggleDropdownOpening(false);
            this.togglerRef.current?.focus();
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
        this.setState({
            ...this.state,
            dataSourceState: {
                ...this.state.dataSourceState,
                focusedIndex: -1,
                search: value,
            },
            opened: !this.state.opened && value.length > 0 ? true : this.state.opened,
        });
    }

    getRows() {
        if (!this.shouldShowBody()) return [];

        const { showSelected, dataSourceState: { topIndex, visibleCount } } = this.state;
        const { getVisibleRows, getSelectedRows } = this.getView();

        if (!showSelected) return getVisibleRows();
        return getSelectedRows().slice(topIndex, topIndex + visibleCount);
    }

    render() {
        const rows = this.getRows();

        return (
            <Dropdown
                renderTarget={ dropdownProps => {
                    const targetProps = this.getTogglerProps(rows);
                    const targetRef = this.getTargetRef({ ...targetProps, ...dropdownProps });
                    return this.renderTarget({ ...dropdownProps, ...targetProps, ...targetRef });
                } }
                renderBody={ props => this.renderBody({ ...props, ...this.getPickerBodyProps(rows), ...this.getListProps() }, rows) }
                value={ this.shouldShowBody() }
                onValueChange={ !this.props.isDisabled && this.toggleBodyOpening }
                placement={ this.props.dropdownPlacement }
                modifiers={ this.popperModifiers }
                closeBodyOnTogglerHidden={ !isMobile() }
            />
        );
    }
}
