import * as React from 'react';
import { Placement } from '@popperjs/core';
import { Modifier } from 'react-popper';
import { DropdownBodyProps, DropdownState, UuiContexts, UuiContext, IHasPlaceholder, IDisableable, DataRowProps, ICanBeReadonly, isMobile, mobilePopperModifier, IDropdownToggler, DataSourceListProps, IHasIcon, IHasRawProps, PickerBaseProps, PickerFooterProps, ICanFocus, CX } from '@epam/uui-core';
import { PickerBase, PickerBaseState, handleDataSourceKeyboard, PickerTogglerProps, DataSourceKeyboardParams, PickerBodyBaseProps, dataSourceStateToValue, applyValueToDataSourceState } from './index';
import { Dropdown } from '../overlays';
import { i18n } from '../i18n';

export type PickerInputBaseProps<TItem, TId> = PickerBaseProps<TItem, TId> & ICanFocus<HTMLElement> & IHasPlaceholder & IDisableable & ICanBeReadonly & IHasIcon & {
    /** dropdown (default) - show selection in dropdown; modal - opens modal window to select items */
    editMode?: 'dropdown' | 'modal';

    /** Maximum number of tags to display in input, before collapsing to "N items selected" mode */
    maxItems?: number;

    /** Minimum width of dropdown body */
    minBodyWidth?: number;

    /** Prevents selected items tags to occupy multiple lines  */
    isSingleLine?: boolean;

    /** Dropdown position relative to the input. See [Popper Docs](@link https://popper.js.org/) */
    dropdownPlacement?: Placement;

    /** Replaces default 'toggler' - an input to which Picker attaches dropdown */
    renderToggler?: (props: PickerTogglerProps<TItem, TId>) => React.ReactNode;

    /**
     *  Defines where search field is:
     * 'input' - try to place search inside the toggler (default for single-select),
     * 'body' - put search inside the dropdown (default for multi-select)
     * 'none' - disables search completely
     */
    searchPosition?: 'input' | 'body' | 'none';

    /** Disallow to clear Picker value (cross icon) */
    disableClear?: boolean;

    /** Minimum characters to type, before search will trigger (default is 1) */
    minCharsToSearch?: number;

    /** Overrides default height of the dropdown body */
    dropdownHeight?: number;

    /** Sets focus to component when it's mounted */
    autoFocus?: boolean;

    /** Prefix text to add to the input */
    prefix?: React.ReactNode;

    /** Suffix text to add to the input */
    suffix?: React.ReactNode;

    /** HTML attributes to put directly to the input and body elements */
    rawProps?: {
        input?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
        body?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
    }

    /** Adds custom footer to the dropdown body */
    renderFooter?: (props: PickerInputFooterProps<TItem, TId>) => React.ReactNode;

    /** Disables moving the dropdown body, when togglers is moved. Used in filters panel, to prevent filter selection to 'jump' after adding a filter. */
    fixedBodyPosition?: boolean;

    portalTarget?: HTMLElement;

    /** CSS class(es) to put on input-part component. See https://github.com/JedWatson/classnames#usage for details */
    inputCx?: CX;
    /** CSS class(es) to put on body-part component. See https://github.com/JedWatson/classnames#usage for details */
    bodyCx?: CX;
};

interface PickerInputFooterProps<TItem, TId> extends PickerFooterProps<TItem, TId> {
    onClose: () => void;
}

interface PickerInputState extends DropdownState, PickerBaseState {
    showSelected: boolean;
    isSearchChanged: boolean;
}

const initialRowsVisible = 20; /* estimated, with some reserve to allow start scrolling without fetching more data */

export abstract class PickerInputBase<TItem, TId, TProps> extends PickerBase<TItem, TId, PickerInputBaseProps<TItem, TId> & TProps, PickerInputState> {
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
    abstract renderBody(props: DropdownBodyProps & DataSourceListProps & Omit<PickerBodyBaseProps, 'rows'>, rows: DataRowProps<TItem, TId>[]): React.ReactNode;

    static getDerivedStateFromProps<TItem, TId>(props: PickerInputBaseProps<TItem, TId>, state: PickerInputState) {
        const prevValue = dataSourceStateToValue(props, state.dataSourceState, props.dataSource);
        if (prevValue !== props.value) {
            return {
                ...state,
                dataSourceState: { ...applyValueToDataSourceState(props, state.dataSourceState, props.value, props.dataSource) },
            };
        }
        if (props.isDisabled && state.opened) {
            return {
                ...state,
                opened: false,
            };
        } else return null;
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
            isSearchChanged: false,
        };
    }

    toggleBodyOpening = (opened: boolean) => {
        if (this.state.opened === opened || (this.props.minCharsToSearch && (this.state.dataSourceState.search?.length ?? 0) < this.props.minCharsToSearch)) return;
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
            dataSourceState: {
                ...this.state.dataSourceState,
                topIndex: 0,
                visibleCount: initialRowsVisible,
                focusedIndex: 0,
                search: '',
            },
            isSearchChanged: false,
            opened,
        });
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
        return this.props.placeholder ?? i18n.pickerInput.defaultPlaceholder(this.getEntityName());
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
            fixedBodyPosition: this.props.fixedBodyPosition,
        };
    }

    getSearchValue = (): string | null => {
        //only for selectionMode = 'single': we're getting current value and put it into search, and when search changed we turn value to dataSourceState.search
        if (this.props.selectionMode === 'single' && !this.state.isSearchChanged && this.props.value) {
            if (this.props.valueType === 'id') {
                return this.getName(this.props?.dataSource.getById(this.props.value as TId));
            }
            if (this.props.valueType === 'entity') {
                return this.getName(this.props.value as TItem);
            }
        }
        return this.state.dataSourceState.search;
    }

    getTogglerProps(rows: DataRowProps<TItem, TId>[], dropdownProps: DropdownBodyProps): PickerTogglerProps<TItem, TId> {
        const view = this.getView();
        const selectedRowsCount = view.getSelectedRowsCount();
        const itemsToTake = selectedRowsCount > this.props.maxItems && this.props.maxItems !== undefined ? this.props.maxItems : 10;
        const selectedRows = this.getSelectedRows(itemsToTake);
        const {
            isDisabled, autoFocus, isInvalid, isReadonly, isSingleLine, maxItems, minCharsToSearch, inputCx,
            validationMessage, validationProps, disableClear: propDisableClear, icon, iconPosition, prefix, suffix,
        } = this.props;
        const searchPosition = this.getSearchPosition();
        const forcedDisabledClear = Boolean(searchPosition === 'body' && !selectedRowsCount);
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
            onFocus: this.props.onFocus,
            onBlur: this.handleBlur,
            onClear: this.handleClearSelection,
            selection: selectedRows,
            selectedRowsCount,
            placeholder: this.getPlaceholder(),
            getName: (i: any) => this.getName(i),
            entityName: this.getEntityName(selectedRowsCount),
            pickerMode: this.isSingleSelect() ? 'single' : 'multi',
            searchPosition,
            onKeyDown: e => this.handlePickerInputKeyboard(rows, e),
            disableSearch: !minCharsToSearch && (!dropdownProps.isOpen || searchPosition !== 'input'),
            disableClear: disableClear,
            toggleDropdownOpening: this.toggleDropdownOpening,
            rawProps: this.props.rawProps?.input,
            value: this.getSearchValue(),
            cx: inputCx,
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
        if (this.props.isDisabled || this.props.isReadonly) return;

        if (e.key === 'Enter' && !this.state.opened) {
            return this.toggleBodyOpening(true);
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
        let isOpen = !this.state.opened && value.length > 0 ? true : this.state.opened;
        if (this.props.minCharsToSearch) {
            isOpen = value.length >= this.props.minCharsToSearch;
        }
        this.setState({
            ...this.state,
            dataSourceState: {
                ...this.state.dataSourceState,
                focusedIndex: -1,
                search: value,
            },
            opened: isOpen,
            isSearchChanged: true,
        });
    }

    handleBlur = (e: React.FocusEvent<HTMLElement>) => {
        this.setState({
            ...this.state,
            dataSourceState: {
                ...this.state.dataSourceState,
                search: '',
            },
            isSearchChanged: false,
            opened: false,
        });

        this.props.onBlur && this.props.onBlur(e);
    }

    getRows() {
        if (!this.shouldShowBody()) return [];

        let preparedRows: DataRowProps<TItem, TId>[];

        const { showSelected, dataSourceState: { topIndex, visibleCount } } = this.state;
        const { getVisibleRows, getSelectedRows } = this.getView();

        if (!showSelected) {
            preparedRows = getVisibleRows();
        } else {
            preparedRows = getSelectedRows(topIndex, visibleCount);
        }

        return preparedRows.map((rowProps) => {
            const newRowProps = { ...rowProps };
            if (rowProps.isSelectable && this.isSingleSelect() && this.props.editMode !== 'modal') {
                newRowProps.onSelect = this.onSelect;
            }

            return newRowProps;
        });
    }

    private handleCloseBody = () => {
        this.toggleBodyOpening(false)
    }

    getFooterProps(): PickerFooterProps<TItem, TId> & { onClose: () => void } {
        const footerProps = super.getFooterProps();
        return { ...footerProps, onClose: this.handleCloseBody };
    }

    returnFocusToInput(): void {
        this.togglerRef.current.focus();
    }

    render() {
        const rows = this.getRows();

        return (
            <Dropdown
                renderTarget={ dropdownProps => {
                    const targetProps = this.getTogglerProps(rows, dropdownProps);
                    const targetRef = this.getTargetRef({ ...targetProps, ...dropdownProps });
                    return this.renderTarget({ ...dropdownProps, ...targetProps, ...targetRef });
                } }
                renderBody={ props => this.renderBody({ ...props, ...this.getPickerBodyProps(rows), ...this.getListProps() }, rows) }
                value={ this.shouldShowBody() }
                onValueChange={ !this.props.isDisabled && this.toggleBodyOpening }
                placement={ this.props.dropdownPlacement }
                modifiers={ this.popperModifiers }
                closeBodyOnTogglerHidden={ !isMobile() }
                portalTarget={ this.props.portalTarget }
            />
        );
    }
}
