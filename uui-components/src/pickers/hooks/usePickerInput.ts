import React, { useMemo, useEffect, useCallback } from 'react';
import { Modifier } from 'react-popper';
import {
    DataRowProps, isMobile, mobilePopperModifier, Lens, PickerFooterProps, DataSourceState,
} from '@epam/uui-core';
import { PickerTogglerProps } from '../PickerToggler';
import { PickerBodyBaseProps } from '../PickerBodyBase';
import { applyValueToDataSourceState, dataSourceStateToValue } from '../bindingHelpers';
import { handleDataSourceKeyboard } from '../KeyboardUtils';
import { i18n } from '../../i18n';
import { usePicker } from './usePicker';
import { usePickerInputState } from './usePickerInputState';
import { UsePickerInputProps } from './types';

const initialRowsVisible = 20; /* estimated, with some reserve to allow start scrolling without fetching more data */

export function usePickerInput<TItem, TId, TProps>(props: UsePickerInputProps<TItem, TId, TProps>) {
    const popperModifiers: Modifier<any>[] = useMemo(() => [
        {
            name: 'offset',
            options: { offset: [0, 6] },
        }, mobilePopperModifier,
    ], []);

    const getSearchPosition = () => {
        if (isMobile() && props.searchPosition !== 'none') return 'body';
        if (props.editMode === 'modal' && props.searchPosition !== 'none') return 'body';
        if (!props.searchPosition) {
            return props.selectionMode === 'multi' ? 'body' : 'input';
        } else {
            return props.searchPosition;
        }
    };

    const pickerInputState = usePickerInputState({
        dataSourceState: { visibleCount: initialRowsVisible, checked: [] },
    });

    const {
        opened, setOpened, isSearchChanged, setIsSearchChanged, setShowSelected, dataSourceState, setDataSourceState,
    } = pickerInputState;

    const defaultShouldShowBody = () => {
        const isOpened = opened && !props.isDisabled;
        if (props.minCharsToSearch && getSearchPosition() === 'input') {
            return isSearchLongEnough() && isOpened;
        }
        return isOpened;
    };

    const isSearchLongEnough = () => props.minCharsToSearch ? (dataSourceState.search?.length ?? 0) >= props.minCharsToSearch : true;

    const shouldShowBody = () => (props.shouldShowBody ?? defaultShouldShowBody)();

    const shouldLoadList = () => isSearchLongEnough() && shouldShowBody();

    const showSelectedOnly = !shouldLoadList() || pickerInputState.showSelected;

    const picker = usePicker<TItem, TId, UsePickerInputProps<TItem, TId, TProps>>({ ...props, showSelectedOnly }, pickerInputState);
    const {
        context,
        view,
        handleDataSourceValueChange,
        getEntityName,
        clearSelection,
        getDataSourceState,
        isSingleSelect,
        getListProps,
        getName,
        handleSelectionValueChange,
        getSelectedRows,
    } = picker;

    const lens = useMemo(
        () => Lens.onEditable<DataSourceState>({ value: dataSourceState, onValueChange: handleDataSourceValueChange }),
        [dataSourceState],
    );

    useEffect(() => {
        const prevValue = dataSourceStateToValue(props, dataSourceState, props.dataSource);
        if (prevValue !== props.value) {
            setDataSourceState((state) =>
                applyValueToDataSourceState(
                    props,
                    state,
                    props.value,
                    props.dataSource,
                ));
        }
    }, [props.value]);

    useEffect(() => {
        const prevValue = dataSourceStateToValue(props, dataSourceState, props.dataSource);
        if (props.value === prevValue && props.isDisabled && opened) {
            setOpened(false);
        }
    }, [props.isDisabled, opened, props.value]);

    const toggleDropdownOpening = (newOpened: boolean) => {
        if (isMobile()) {
            const modals = context.uuiModals.getOperations();
            document.body.style.overflow = !newOpened && modals.length === 0 ? '' : 'hidden';
        }

        handleDataSourceValueChange((prevState) => ({
            ...prevState,
            topIndex: 0,
            visibleCount: initialRowsVisible,
            focusedIndex: 0,
            scrollTo: undefined,
            search: '',
        }));

        setIsSearchChanged(false);
        setOpened(newOpened);
        setShowSelected(false);
    };

    const toggleBodyOpening = (newOpened: boolean) => {
        if (opened === newOpened || (getSearchPosition() === 'input' && !isSearchLongEnough())) {
            return;
        }
        if (props.editMode === 'modal') {
            props.toggleModalOpening?.(newOpened);
        } else {
            toggleDropdownOpening(newOpened);
        }
    };

    const onSelect = (row: DataRowProps<TItem, TId>) => {
        toggleDropdownOpening(false);
        handleDataSourceValueChange((currentState) => ({ ...currentState, search: '', selectedId: row.id }));
    };

    const getPlaceholder = () => props.placeholder ?? i18n.pickerInput.defaultPlaceholder(getEntityName());

    const handleClearSelection = () => {
        toggleDropdownOpening(false);
        clearSelection();
    };

    const handlePickerInputKeyboard = (
        rows: DataRowProps<TItem, TId>[],
        e: React.KeyboardEvent<HTMLElement>,
        actualSearch?: string,
    ) => {
        if (props.isDisabled || props.isReadonly) return;

        if (e.key === 'Enter' && !opened) {
            return toggleBodyOpening(true);
        }

        if (e.key === 'Escape' && opened) {
            e.preventDefault();
            toggleDropdownOpening(false);
        }

        const value = getDataSourceState();
        handleDataSourceKeyboard(
            {
                value: actualSearch !== undefined ? { ...value, search: actualSearch } : value,
                onValueChange: handleDataSourceValueChange,
                listView: view,
                searchPosition: getSearchPosition(),
                rows,
            },
            e,
        );
    };

    const getPickerBodyProps = (rows: DataRowProps<TItem, TId>[]): Omit<PickerBodyBaseProps, 'rows'> => {
        return {
            value: getDataSourceState(),
            onValueChange: handleDataSourceValueChange,
            search: lens.prop('search').toProps(),
            showSearch: getSearchPosition() === 'body',
            rawProps: {
                'aria-multiselectable': props.selectionMode === 'multi' ? true : null,
                'aria-orientation': 'vertical',
                ...props.rawProps?.body,
            },
            renderNotFound: props.renderNotFound,
            renderEmpty: props.renderEmpty,
            onKeyDown: (e) => handlePickerInputKeyboard(rows, e),
            minCharsToSearch: props.minCharsToSearch,
            fixedBodyPosition: props.fixedBodyPosition,
            searchDebounceDelay: props.searchDebounceDelay,
        };
    };

    const handleTogglerSearchChange = useCallback((value: string) => {
        let isOpen = !opened && value.length > 0 ? true : opened;
        if (props.minCharsToSearch) {
            isOpen = value.length >= props.minCharsToSearch;
        }

        handleDataSourceValueChange((dsState) => ({
            ...dsState,
            focusedIndex: 0,
            search: value,
        }));

        setOpened(isOpen);
        setIsSearchChanged(true);
    }, [opened, props.minCharsToSearch, dataSourceState, handleDataSourceValueChange, setOpened, setIsSearchChanged]);

    const closePickerBody = useCallback(() => {
        handleDataSourceValueChange((dsState) => ({
            ...dsState,
            search: '',
        }));
        setOpened(false);
        setIsSearchChanged(false);
    }, [handleDataSourceValueChange, setOpened, setIsSearchChanged]);

    const getRows = () => {
        if (!shouldShowBody() || !isSearchLongEnough()) return [];

        const preparedRows = view.getVisibleRows();

        return preparedRows.map((rowProps) => {
            const newRowProps = { ...rowProps };
            if (rowProps.isSelectable && isSingleSelect() && props.editMode !== 'modal') {
                newRowProps.onSelect = onSelect;
            }

            return newRowProps;
        });
    };

    const handleCloseBody = () => {
        toggleBodyOpening(false);
    };

    const openPickerBody = () => toggleBodyOpening(true);

    const getFooterProps = (): PickerFooterProps<TItem, TId> & { onClose: () => void } => {
        const footerProps = picker.getFooterProps();
        return {
            ...footerProps,
            onClose: handleCloseBody,
            selectionMode: props.selectionMode,
            disableClear: props.disableClear,
            isSearchTooShort: !isSearchLongEnough(),
        };
    };

    const getSearchValue = (): string | null => {
        // only for selectionMode = 'single': we're getting current value and put it into search, and when search changed we turn value to dataSourceState.search
        if (props.selectionMode === 'single' && !isSearchChanged && (props.value !== undefined && props.value !== null)) {
            if (props.valueType === 'id') {
                return getName(props?.dataSource.getById(props.value as TId));
            }
            if (props.valueType === 'entity') {
                return getName(props.value as TItem);
            }
        }
        return dataSourceState.search;
    };

    const selectedRows = useMemo(() => getSelectedRows(view.getSelectedRowsCount()), [view, dataSourceState.checked]);

    const getTogglerProps = (): PickerTogglerProps<TItem, TId> => {
        const selectedRowsCount = view.getSelectedRowsCount();
        const {
            isDisabled,
            autoFocus,
            isInvalid,
            isReadonly,
            isSingleLine,
            maxItems,
            minCharsToSearch,
            inputCx,
            disableClear: propDisableClear,
            icon,
            iconPosition,
            onIconClick,
            id,
        } = props;
        const forcedDisabledClear = Boolean(getSearchPosition() === 'body' && !selectedRowsCount);
        const disableClear = forcedDisabledClear || propDisableClear;
        let searchValue: string | undefined = getSearchValue();
        if (isSingleSelect() && selectedRows[0]?.isLoading) {
            searchValue = undefined;
        }
        const searchPosition = getSearchPosition();
        return {
            isSingleLine,
            maxItems,
            minCharsToSearch,
            isInvalid,
            isReadonly,
            isDisabled,
            autoFocus,
            icon,
            iconPosition,
            onIconClick,
            onFocus: props.onFocus,
            onClear: handleClearSelection,
            onBlur: props.onBlur,
            selection: selectedRows,
            selectedRowsCount,
            placeholder: getPlaceholder(),
            getName: (i: any) => getName(i),
            entityName: getEntityName(selectedRowsCount),
            pickerMode: isSingleSelect() ? 'single' : 'multi',
            searchPosition,
            disableSearch: searchPosition !== 'input',
            disableClear: disableClear,
            toggleDropdownOpening,
            closePickerBody,
            rawProps: props.rawProps?.input,
            value: searchValue,
            cx: inputCx,
            id,
        };
    };

    return {
        view,
        context,
        dataSourceState,
        getPlaceholder,
        getName,
        getRows,
        getTogglerProps,
        getFooterProps,
        shouldShowBody,
        toggleBodyOpening,
        isSingleSelect,
        popperModifiers,
        getPickerBodyProps,
        getListProps,
        handleTogglerSearchChange,
        handleDataSourceValueChange,
        handleSelectionValueChange,
        getSearchPosition,
        closePickerBody,
        openPickerBody,
        handlePickerInputKeyboard,
    };
}
