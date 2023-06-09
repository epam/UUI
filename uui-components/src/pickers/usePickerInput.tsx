import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Modifier } from 'react-popper';
import { DropdownBodyProps, DataRowProps, isMobile, mobilePopperModifier, IDropdownToggler, Lens, PickerFooterProps } from '@epam/uui-core';
import { PickerBaseState, handleDataSourceKeyboard, PickerTogglerProps, DataSourceKeyboardParams, PickerBodyBaseProps, applyValueToDataSourceState, PickerInputBaseProps } from './index';
import { i18n } from '../i18n';
import { getMaxItems } from './helpers';
import { usePicker } from './usePicker';
import { usePickerState } from './usePickerState';

const initialRowsVisible = 20; /* estimated, with some reserve to allow start scrolling without fetching more data */

type UsePickerInputProps<TItem, TId, TProps> = PickerInputBaseProps<TItem, TId> & TProps & {
    toggleModalOpening(opened: boolean): void;
};

export function usePickerInput<TItem, TId, TProps>(props: UsePickerInputProps<TItem, TId, TProps>) {
    const popperModifiers: Modifier<any>[] = useMemo(() => [
        {
            name: 'offset',
            options: { offset: [0, 6] },
        }, mobilePopperModifier,
    ], []);

    const togglerRef = useRef<HTMLElement>();
    const pickerState = usePickerState({
        dataSourceState: { visibleCount: initialRowsVisible },
    });
    const [opened, setOpened] = useState<boolean>(false);
    const [isSearchChanged, setIsSearchChanged] = useState<boolean>(false);

    const picker = usePicker(props, pickerState);
    const {
        context,
        dataSourceState,
        getView,
        handleDataSourceValueChange,
        getEntityName,
        clearSelection,
        getDataSourceState,
        isSingleSelect,
        getListProps,
        getName,
        getSelectedRows,
        handleSelectionValueChange,
    } = picker;

    const lens = useMemo(
        () => Lens.onState<PickerBaseState>(pickerState),
        [pickerState.dataSourceState],
    );

    useEffect(() => {
        pickerState.setDataSourceState(
            applyValueToDataSourceState(
                props,
                pickerState.dataSourceState,
                props.value,
                props.dataSource,
            ),
        );
    }, [props.value]);
    
    useEffect(() => {
        if (props.isDisabled && opened) {
            setOpened(false);
        }
    }, [props.isDisabled, opened]);
    
    const toggleDropdownOpening = (newOpened: boolean) => {
        if (isMobile()) {
            document.body.style.overflow = opened ? 'hidden' : '';
        }

        pickerState.setDataSourceState({
            ...pickerState.dataSourceState,
            topIndex: 0,
            visibleCount: initialRowsVisible,
            focusedIndex: 0,
            search: '',
        });

        setIsSearchChanged(false);
        setOpened(newOpened);
    };

    const toggleBodyOpening = (newOpened: boolean) => {
        if (opened === newOpened
            || (props.minCharsToSearch && (pickerState.dataSourceState.search?.length ?? 0) < props.minCharsToSearch)
        ) {
            return;
        }
        if (props.editMode === 'modal') {
            props.toggleModalOpening(opened);
        } else {
            toggleDropdownOpening(opened);
        }
    };
    
    const onSelect = (row: DataRowProps<TItem, TId>) => {
        toggleDropdownOpening(false);
        handleDataSourceValueChange({ ...pickerState.dataSourceState, search: '', selectedId: row.id });
        togglerRef.current?.focus();
    };
    
    const getSearchPosition = () => {
        if (isMobile() && props.searchPosition !== 'none') return 'body';
        if (!props.searchPosition) {
            return props.selectionMode === 'multi' ? 'body' : 'input';
        } else {
            return props.searchPosition;
        }
    };
    
    const getPlaceholder = () => props.placeholder ?? i18n.pickerInput.defaultPlaceholder(getEntityName());
    
    const handleClearSelection = () => {
        toggleDropdownOpening(false);
        clearSelection();
    };
    
    const shouldShowBody = () => {
        const searchPosition = props.searchPosition || 'input';
        const isOpened = opened && !props.isDisabled;

        if (props.minCharsToSearch && props.editMode !== 'modal' && searchPosition === 'input') {
            const isEnoughSearchLength = pickerState.dataSourceState.search
                ? pickerState.dataSourceState.search.length >= props.minCharsToSearch
                : false;
            return isEnoughSearchLength && isOpened;
        }
        return isOpened;
    };

    const handlePickerInputKeyboard = (rows: DataSourceKeyboardParams['rows'], e: React.KeyboardEvent<HTMLElement>) => {
        if (props.isDisabled || props.isReadonly) return;

        if (e.key === 'Enter' && !opened) {
            return toggleBodyOpening(true);
        }

        if (e.key === 'Escape' && opened) {
            e.preventDefault();
            toggleDropdownOpening(false);
            togglerRef.current?.focus();
        }

        handleDataSourceKeyboard(
            {
                value: getDataSourceState(),
                onValueChange: handleDataSourceValueChange,
                listView: getView(),
                editMode: props.editMode,
                rows,
            },
            e,
        );
    };

    const getPickerBodyProps = (rows: DataRowProps<TItem, TId>[]): Omit<PickerBodyBaseProps, 'rows'> => {
        return {
            value: getDataSourceState(),
            onValueChange: handleDataSourceValueChange,
            search: lens.prop('dataSourceState').prop('search').toProps(),
            showSearch: getSearchPosition() === 'body',
            rawProps: {
                'aria-multiselectable': props.selectionMode === 'multi' ? true : null,
                'aria-orientation': 'vertical',
                ...props.rawProps?.body,
            },
            renderNotFound:
                props.renderNotFound
                && (() =>
                    props.renderNotFound({
                        search: pickerState.dataSourceState.search,
                        onClose: () => toggleBodyOpening(false),
                    })),
            onKeyDown: (e) => handlePickerInputKeyboard(rows, e),
            fixedBodyPosition: props.fixedBodyPosition,
        };
    };
    
    const handleTogglerSearchChange = (value: string) => {
        let isOpen = !opened && value.length > 0 ? true : opened;
        if (props.minCharsToSearch) {
            isOpen = value.length >= props.minCharsToSearch;
        }

        pickerState.setDataSourceState((dsState) => ({
            ...dsState,
            focusedIndex: -1,
            search: value,
        }));
        
        setOpened(isOpen);
        setIsSearchChanged(true);
    };
    
    const closePickerBody = () => {
        pickerState.setDataSourceState((dsState) => ({
            ...dsState,
            search: '',
        }));
        setOpened(false);
        setIsSearchChanged(false);
    };

    const getRows = () => {
        if (!shouldShowBody()) return [];

        let preparedRows: DataRowProps<TItem, TId>[];

        const view = getView();

        if (!pickerState.showSelected) {
            preparedRows = view.getVisibleRows();
        } else {
            const { topIndex, visibleCount } = pickerState.dataSourceState;
            preparedRows = view.getSelectedRows({ topIndex, visibleCount });
        }

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
    
    const getFooterProps = (): PickerFooterProps<TItem, TId> & { onClose: () => void } => {
        const footerProps = picker.getFooterProps();
        return { ...footerProps, onClose: handleCloseBody, selectionMode: props.selectionMode };
    };

    const returnFocusToInput = (): void => {
        togglerRef.current.focus();
    };
    
    const getSearchValue = (): string | null => {
        // only for selectionMode = 'single': we're getting current value and put it into search, and when search changed we turn value to dataSourceState.search
        if (props.selectionMode === 'single' && !isSearchChanged && props.value) {
            if (props.valueType === 'id') {
                return getName(props?.dataSource.getById(props.value as TId));
            }
            if (props.valueType === 'entity') {
                return getName(props.value as TItem);
            }
        }
        return pickerState.dataSourceState.search;
    };
    
    const getTogglerProps = (rows: DataRowProps<TItem, TId>[], dropdownProps: DropdownBodyProps): PickerTogglerProps<TItem, TId> => {
        const view = getView();
        const selectedRowsCount = view.getSelectedRowsCount();
        const allowedMaxItems = getMaxItems(props.maxItems);
        const itemsToTake = selectedRowsCount > allowedMaxItems ? allowedMaxItems : selectedRowsCount;
        const selectedRows = getSelectedRows(itemsToTake);
        const {
            isDisabled,
            autoFocus,
            isInvalid,
            isReadonly,
            isSingleLine,
            maxItems,
            minCharsToSearch,
            inputCx,
            validationMessage,
            validationProps,
            disableClear: propDisableClear,
            icon,
            iconPosition,
        } = props;
        const searchPosition = getSearchPosition();
        const forcedDisabledClear = Boolean(searchPosition === 'body' && !selectedRowsCount);
        const disableClear = forcedDisabledClear || propDisableClear;
        let searchValue: string | undefined = getSearchValue();
        if (isSingleSelect() && selectedRows[0]?.isLoading) {
            searchValue = undefined;
        }

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
            onKeyDown: (e) => handlePickerInputKeyboard(rows, e),
            disableSearch: !minCharsToSearch && (!dropdownProps.isOpen || searchPosition !== 'input'),
            disableClear: disableClear,
            toggleDropdownOpening: toggleDropdownOpening,
            closePickerBody: closePickerBody,
            rawProps: props.rawProps?.input,
            value: searchValue,
            cx: inputCx,
        };
    };
    
    const getTargetRef = (props: IDropdownToggler & PickerTogglerProps<TItem, TId>) => {
        return {
            ref: (node: HTMLElement) => {
                (togglerRef as React.MutableRefObject<HTMLElement>).current = node;
                (props.ref as React.RefCallback<HTMLElement>)(node);
            },
        };
    };

    return {
        context,
        dataSourceState,
        getPlaceholder,
        getName,
        getRows,
        getTargetRef,
        getTogglerProps,
        getFooterProps,
        returnFocusToInput,
        shouldShowBody,
        toggleBodyOpening,
        popperModifiers,
        getPickerBodyProps,
        getListProps,
        handleTogglerSearchChange,
        handleSelectionValueChange,
    };
}
