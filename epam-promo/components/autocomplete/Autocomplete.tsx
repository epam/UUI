import React from 'react';
import {
    DataRowOptions,
    DataRowProps,
    DataSourceState,
    IAnalyticableOnChange,
    ICanBeInvalid,
    ICanBeReadonly,
    IDataSource, IDataSourceView,
    IDisableable,
    IEditable,
    IEditableDebouncer,
    IHasPlaceholder,
    isMobile,
    Lens,
    mobilePopperModifier,
    UuiContext,
    UuiContexts,
} from "@epam/uui";
import {
    DropdownBodyProps,
    Dropdown,
    PickerTogglerProps,
    PickerBaseState,
    i18n,
    DataSourceKeyboardParams,
    handleDataSourceKeyboard,
} from "@epam/uui-components";
import { Panel } from "../layout";
import css from "./Autocomplete.scss";
import {
    DataPickerBody,
    DataPickerRow,
    MobileDropdownWrapper,
    PickerItem,
    PickerTogglerMods,
    PickerToggler,
} from "../pickers";
import { Modifier } from "react-popper";
import { EditMode, IHasEditMode, SizeMod } from '../types';
import { Placement } from "@popperjs/core";
import { findDOMNode } from "react-dom";

const pickerBodyHeight = 300;
const pickerBodyWidth = 360;

interface AutocompleteInputState extends PickerBaseState {
    opened: boolean;
}

export interface AutocompleteInputProps<TItem, TId> extends IEditable<any>, SizeMod, IHasEditMode, ICanBeInvalid, IAnalyticableOnChange<any>, IHasPlaceholder, IDisableable, ICanBeReadonly {
    minBodyWidth?: number;
    dropdownPlacement?: Placement;
    disableClear?: boolean;
    minCharsToSearch?: number;
    dropdownHeight?: number;
    autoFocus?: boolean;
    onFocus?: (e?: React.SyntheticEvent<HTMLElement>) => void;
    onBlur?: (e: React.SyntheticEvent<HTMLElement>) => void;
    entityName?: string;
    dataSource: IDataSource<TItem, TId, any>;
    getName?: (item: TItem) => string;
    getRowOptions?: (item: TItem, index: number) => DataRowOptions<TItem, TId>;
}

const initialRowsVisible = 20;

export class Autocomplete<TItem, TId> extends React.Component<AutocompleteInputProps<TItem, TId>, AutocompleteInputState> {
    state: AutocompleteInputState = this.getInitialState();
    lens = Lens.onState<PickerBaseState>(this);
    static contextType = UuiContext;
    context: UuiContexts;
    private togglerRef = React.createRef<HTMLDivElement>();
    private readonly popperModifiers: Modifier<any>[] = [
        {
            name: 'offset',
            options: { offset: [0, 6] },
        },
        mobilePopperModifier,
    ];

    componentWillUnmount = (): void => {
        this.props.dataSource.unsubscribeView(this.handleDataSourceValueChange);
    }

    getInitialState() {
        return {
            opened: false,
            dataSourceState: {
                focusedIndex: 0,
                topIndex: 0,
                search: this.props.value,
                visibleCount: initialRowsVisible,
            },
        };
    }

    getRowSize() {
        return isMobile() ? "48" : this.props.size;
    }

    getName = (i: TItem) => {
        if (i == null) {
            return '';
        } else if (this.props.getName) {
            return this.props.getName(i);
        } else {
            return (i as any).name;
        }
    }

    getEntityName = () => this.props.entityName || '';

    toggleDropdownOpening = (opened: boolean) => {
        if (isMobile()) {
            document.body.style.overflow = opened ? "hidden" : "";
        }

        this.setState({
            opened,
            dataSourceState: {
                ...this.state.dataSourceState,
                topIndex: 0,
                visibleCount: initialRowsVisible,
                focusedIndex: -1,
            },
        });
    }
    onFocus = (e: React.SyntheticEvent<HTMLElement>) => {
        this.props.onFocus && this.props.onFocus(e);
    }

    onBlur = (e: React.SyntheticEvent<HTMLElement>) => {
        this.props.onBlur && this.props.onBlur(e);
    }

    onSelect = (row: DataRowProps<TItem, TId>) => {
        (findDOMNode(this.togglerRef.current) as HTMLElement).focus();
        const value = this.getName(row.value);
        this.handleDataSourceValueChange({ ...this.state.dataSourceState, search: value });
    }

    getPlaceholder() {
        return this.props.placeholder || i18n.pickerInput.defaultPlaceholder(this.getEntityName() ? this.getEntityName() : "");
    }

    handleClearSelection = () => {
        this.toggleDropdownOpening(false);
        this.clearSelection();
    }

    shouldShowBody() {
        const opened = this.state.opened && !this.props.isDisabled;
        const minCharsSize = this.props.minCharsToSearch || 1;
        const isEnoughSearchLength = this.state.dataSourceState.search ? this.state.dataSourceState.search.length >= minCharsSize : false;
        return isEnoughSearchLength && opened;
    }

    handlePickerInputKeyboard = (rows: DataSourceKeyboardParams['rows'], e: React.KeyboardEvent<HTMLElement>) => {
        if (this.props.isDisabled) return;

        if (e.key === 'Escape' && this.state.opened) {
            e.preventDefault();
            this.toggleDropdownOpening(false);
        }

        handleDataSourceKeyboard({
            value: this.state.dataSourceState,
            onValueChange: this.handleDataSourceValueChange,
            listView: this.getView(),
            editMode: 'dropdown',
            rows,
        }, e);
    }

    handleTogglerSearchChange = (value: string) => {
        const newDataSourceState = { ...this.state.dataSourceState, search: value, focusedIndex: -1};
        this.setState({
            ...this.state,
            dataSourceState: newDataSourceState,
            opened: value.length > 0,
        });
        this.props.onValueChange && this.props.onValueChange(value);
    }

    getRows() {
        const view = this.getView();
        return view.getVisibleRows();
    }

    protected handleSelectionValueChange = (newValue: DataSourceState<any, TId>) => {
        (this.props.onValueChange as any)(newValue.search);

        if (this.props.getValueChangeAnalyticsEvent) {
            const event = this.props.getValueChangeAnalyticsEvent(newValue, this.props.value);
            this.context.uuiAnalytics.sendEvent(event);
        }
    }

    protected handleDataSourceValueChange = (newDataSourceState: DataSourceState) => {
        this.setState(s => ({ ...s, dataSourceState: newDataSourceState }));
        if (this.props.value !== newDataSourceState.search) {
            this.handleSelectionValueChange(newDataSourceState);
        }
    }

    getRowOptions = (item: TItem, index: number) => {
        let options: DataRowOptions<TItem, TId> = {};
        options.isSelectable = true;
        options.checkbox = { isVisible: false };

        const externalOptions = this.props.getRowOptions ? this.props.getRowOptions(item, index) : {};

        return { ...options, ...externalOptions };
    }

    clearSelection = () => {
        this.handleDataSourceValueChange({
            ...this.state.dataSourceState,
            search: '',
        });
    }


    getListProps() {
        const view = this.getView();
        return view.getListProps();
    }

    getView(): IDataSourceView<TItem, TId, any> {
        return this.props.dataSource.getView(this.state.dataSourceState, this.handleDataSourceValueChange, {
            getRowOptions: this.getRowOptions,
            getSearchFields: (item: TItem) => [this.getName(item)],
        });
    }

    renderItem = (item: TItem, rowProps: DataRowProps<TItem, TId>) => {
        return <PickerItem title={ this.getName(item) } size={ this.getRowSize() } { ...rowProps } />;
    }

    renderRow = (rowProps: DataRowProps<TItem, TId>) => {
        rowProps.onSelect = this.onSelect;
        rowProps.onFold = this.onSelect;
        return (
            <DataPickerRow
                { ...rowProps }
                key={ rowProps.rowKey }
                isSelected={ this.getName(rowProps.value) === this.state.dataSourceState.search }
                borderBottom="none"
                size={ this.getRowSize() }
                padding='12'
                renderItem={ this.renderItem }
            />
        );
    }

    getTogglerProps(rows: DataRowProps<TItem, TId>[]): PickerTogglerProps<TItem, TId> & PickerTogglerMods {

        const view = this.getView();
        let selectedRows = view.getSelectedRows();
        const { isDisabled, autoFocus, isInvalid, isReadonly,
            validationMessage, validationProps, disableClear: propDisableClear } = this.props;

        return {
            isInvalid,
            validationProps,
            validationMessage,
            isReadonly,
            isDisabled,
            autoFocus,
            onFocus: this.onFocus,
            onBlur: this.onBlur,
            onClear: this.handleClearSelection,
            selection: selectedRows,
            placeholder: this.getPlaceholder(),
            getName: (i: any) => this.getName(i),
            pickerMode: 'single',
            onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => this.handlePickerInputKeyboard(rows, e),
            disableClear: propDisableClear,
            toggleDropdownOpening: this.toggleDropdownOpening,
            size: this.props.size as PickerTogglerMods['size'],
            mode: this.props.mode || EditMode.FORM,
            ref: this.togglerRef,
        };
    }

    render() {
        const rows = this.getRows();
        const renderedDataRows = rows.map((props: DataRowProps<TItem, TId>) => this.renderRow(props));
        const renderTarget = (props: PickerTogglerProps<any>) => <PickerToggler { ...props } />;

        const maxHeight = isMobile()
            ? document.documentElement.clientHeight
            : (this.props.dropdownHeight || pickerBodyHeight);
        const minBodyWidth = isMobile()
            ? document.documentElement.clientWidth
            : (this.props.minBodyWidth || pickerBodyWidth);

        return (
            <Dropdown
                renderTarget={ dropdownProps =>
                    <IEditableDebouncer
                        value={ this.state.dataSourceState.search }
                        onValueChange={ this.handleTogglerSearchChange }
                        render={ editableProps => renderTarget({ ...this.getTogglerProps(rows), ...dropdownProps, ...editableProps }) }
                    />
                }
                renderBody={ (props: DropdownBodyProps) => !!renderedDataRows.length &&
                        <Panel
                            shadow
                            style={ { width: props.togglerWidth > minBodyWidth ? props.togglerWidth : minBodyWidth } }
                            cx={ css.panel }
                        >
                            <MobileDropdownWrapper
                                title={ this.props.entityName }
                                close={ () => this.toggleDropdownOpening(false) }
                            >
                                <DataPickerBody
                                    { ...this.getListProps() }
                                    value={ this.state.dataSourceState }
                                    onValueChange={ this.handleDataSourceValueChange }
                                    search={ this.lens.prop('dataSourceState').prop('search').toProps() }
                                    rows={ renderedDataRows }
                                    maxHeight={ maxHeight }
                                    onKeyDown={ (e: React.KeyboardEvent<HTMLElement>) => this.handlePickerInputKeyboard(rows, e) }
                                    scheduleUpdate={ props.scheduleUpdate }
                                    searchSize={ this.props.size }
                                />
                            </MobileDropdownWrapper>
                        </Panel>
                    }
                value={ this.shouldShowBody() }
                onValueChange={ !this.props.isDisabled && this.toggleDropdownOpening }
                placement={ this.props.dropdownPlacement }
                modifiers={ this.popperModifiers }
            />
        );
    }
}