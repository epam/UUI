import React, { useMemo, useEffect, useCallback, useContext, useState } from 'react';
import { DataRowProps, isMobile, PickerFooterProps, UuiContext, PickerInputBaseProps, DataSourceState } from '@epam/uui-core';
import { PickerTogglerProps } from '../PickerToggler';
import { dataSourceStateToValue } from '../bindingHelpers';
import { handleDataSourceKeyboard } from '../KeyboardUtils';
import { i18n } from '../../i18n';
import { usePickerApi } from './usePickerApi';
import { useShowSelected } from './useShowSelected';

const initialRowsVisible = 20; /* estimated, with some reserve to allow start scrolling without fetching more data */
const defaultMaxItems = 20;

export type UsePickerInputProps<TItem, TId, TProps> = PickerInputBaseProps<TItem, TId> & TProps & {
    toggleModalOpening?(opened: boolean): void;
};

export function usePickerInput<TItem, TId, TProps>(props: UsePickerInputProps<TItem, TId, TProps>) {
    const context = useContext(UuiContext);
    const [opened, setOpened] = useState<boolean>(false);
    const [isSearchChanged, setIsSearchChanged] = useState<boolean>(false);

    const [dsState, setDsState] = useState<DataSourceState>({
        focusedIndex: 0,
        topIndex: 0,
        visibleCount: 20,
        checked: [],
    });

    const { showSelected, setShowSelected } = useShowSelected({ dataSourceState: dsState });

    const getSearchPosition = () => {
        if (isMobile() && props.searchPosition !== 'none') return 'body';
        if (props.editMode === 'modal' && props.searchPosition !== 'none') return 'body';
        if (!props.searchPosition) {
            return props.selectionMode === 'multi' ? 'body' : 'input';
        } else {
            return props.searchPosition;
        }
    };

    const isSearchLongEnough = () => props.minCharsToSearch ? (dsState.search?.length ?? 0) >= props.minCharsToSearch : true;

    const shouldShowBody = () => {
        const isOpened = opened && !props.isDisabled;
        if (props.minCharsToSearch && getSearchPosition() === 'input') {
            return isSearchLongEnough() && isOpened;
        }
        return isOpened;
    };
    const shouldLoadList = () => isSearchLongEnough() && shouldShowBody();

    const showSelectedOnly = !shouldLoadList() || showSelected;

    const picker = usePickerApi<TItem, TId>({ ...props, dataSourceState: dsState, setDataSourceState: setDsState, showSelectedOnly });
    const {
        view,
        handleDataSourceValueChange,
        dataSourceState,
        getEntityName,
        clearSelection,
        isSingleSelect,
        getListProps,
        getName,
        handleSelectionValueChange,
        getSelectedRows,
    } = picker;

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
        handleDataSourceValueChange((currentState) => ({ ...currentState, selectedId: row.id }));
    };

    const getPlaceholder = () => props.placeholder ?? i18n.pickerInput.defaultPlaceholder(getEntityName());

    const handleClearSelection = () => {
        toggleDropdownOpening(false);
        clearSelection();
    };

    const handlePickerInputKeyboard = (
        rows: DataRowProps<TItem, TId>[],
        event: React.KeyboardEvent,
        actualSearch?: string,
    ) => {
        if (props.isDisabled || props.isReadonly) return;

        if (event.key === 'Enter' && !opened) {
            return toggleBodyOpening(true);
        }

        if (event.key === 'Escape' && opened) {
            event.preventDefault();
            event.stopPropagation();
            toggleDropdownOpening(false);
        }

        const value = dataSourceState;
        handleDataSourceKeyboard(
            {
                value: actualSearch !== undefined ? { ...value, search: actualSearch } : value,
                onValueChange: handleDataSourceValueChange,
                listView: view,
                searchPosition: getSearchPosition(),
                rows,
            },
            event,
        );
    };

    const handleTogglerSearchChange = useCallback((value: string) => {
        let isOpen = !opened && value.length > 0 ? true : opened;
        if (props.minCharsToSearch) {
            isOpen = value.length >= props.minCharsToSearch;
        }

        handleDataSourceValueChange((state) => ({
            ...state,
            focusedIndex: 0,
            search: value,
        }));

        setOpened(isOpen);
        setIsSearchChanged(true);
    }, [opened, props.minCharsToSearch, dataSourceState, handleDataSourceValueChange, setOpened, setIsSearchChanged]);

    const closePickerBody = useCallback(() => {
        handleDataSourceValueChange((state) => ({
            ...state,
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
            if (rowProps.isSelectable && isSingleSelect()) {
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
        return {
            view,
            showSelected: {
                value: showSelected,
                onValueChange: setShowSelected,
            },
            clearSelection,
            selection: props.value,
            search: dataSourceState.search,
            onClose: handleCloseBody,
            selectionMode: props.selectionMode,
            disableClear: props.disableClear,
            isSearchTooShort: !isSearchLongEnough(),
        };
    };

    const getSearchValue = (): string | null => {
        // only for selectionMode = 'single': we're getting current value and put it into search, and when search changed we turn value to dataSourceState.search
        if (props.selectionMode === 'single' && !isSearchChanged && (props.value !== undefined && props.value !== null)) {
            if (props.valueType === 'entity') {
                return getName(props.value as TItem);
            }

            return getName(props?.dataSource.getById(props.value as TId));
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
            maxItems = defaultMaxItems,
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
        dataSourceState,
        getPlaceholder,
        getName,
        getRows,
        getTogglerProps,
        getFooterProps,
        shouldShowBody,
        toggleBodyOpening,
        isSingleSelect,
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
