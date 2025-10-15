import React, { useEffect, useMemo } from 'react';
import {
    DataSourceState, isMobile, cx, Overwrite, IDropdownBodyProps, devLogger, DataSourceListProps, IEditable,
    IHasRawProps, usePrevious, DataRowProps, FlattenSearchResultsConfig,
} from '@epam/uui-core';
import { FlexCell } from '@epam/uui-components';
import { SearchInput } from '../inputs';
import { FlexRow, VirtualList } from '../layout';
import { Text } from '../typography';
import { i18n } from '../../i18n';
import { settings } from '../../settings';
import css from './DataPickerBody.module.scss';
import isEqual from 'react-fast-compare';
import { DataPickerRow } from './DataPickerRow';
import type { PickerInputProps } from './PickerInput';
import { MoveFocusInside } from 'react-focus-lock';

export interface DataPickerBodyModsOverride {}

interface DataPickerBodyMods {
    searchSize?: PickerInputProps<any, any>['size'];
}

export interface DataPickerBodyProps<TItem = unknown, TId = unknown> extends Overwrite<DataPickerBodyMods, DataPickerBodyModsOverride>,
    Pick<PickerInputProps<TItem, TId>, 'size' | 'renderRow' | 'highlightSearchMatches' | 'getName' | 'minCharsToSearch' | 'renderEmpty' | 'renderNotFound' | 'fixedBodyPosition' | 'searchDebounceDelay'>,
    FlattenSearchResultsConfig, DataSourceListProps, IEditable<DataSourceState>, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IDropdownBodyProps {
    maxHeight?: number;
    selectionMode?: 'single' | 'multi';
    maxWidth?: number;
    onKeyDown?(e: React.KeyboardEvent<HTMLElement>): void;
    rows: DataRowProps<TItem, TId>[];
    showSearch?: boolean | 'auto';
    /** A pure function that gets entity name from entity object */
    getName: (item: TItem) => string;
}

export function DataPickerBody<TItem, TId>({ highlightSearchMatches = true, ...props }:DataPickerBodyProps<TItem, TId>) {
    const prevProps = usePrevious(props);
    const showSearch = props.showSearch === 'auto' ? props.totalCount > 10 : Boolean(props.showSearch);

    useEffect(() => {
        if (props.rows.length !== prevProps?.rows.length || (!isEqual(prevProps?.value.checked, props.value.checked) && !props.fixedBodyPosition)) {
            props.scheduleUpdate?.();
        }
    }, [props.rows, prevProps, props.value.checked, props.fixedBodyPosition]);

    const searchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        props.onKeyDown?.(e);
        if (e.shiftKey && e.key === 'Tab') e.preventDefault();
    };

    const focusedRowId = useMemo((): string => {
        // No need to make unnecessary calculations.
        if (!props.showSearch) {
            return '';
        }

        const focusedRow = props.rows.find((row) => {
            return row.isFocused;
        });

        if (!focusedRow) {
            return '';
        }

        return focusedRow.rowKey;
    }, [props.showSearch, props.rows]);

    const renderEmpty = () => {
        const search = props.value.search;

        if (props.renderEmpty) {
            return props.renderEmpty({
                minCharsToSearch: props.minCharsToSearch,
                onClose: props.onClose,
                search: search,
            });
        }

        if (props.minCharsToSearch && search.length < props.minCharsToSearch) {
            return (
                <FlexCell cx={ css.noData } grow={ 1 } textAlign="center">
                    <Text size={ props.searchSize }>{i18n.dataPickerBody.typeSearchToLoadMessage}</Text>
                </FlexCell>
            );
        }

        if (props.rows.length === 0) {
            if (props.renderNotFound) {
                if (__DEV__) {
                    devLogger.warn('[PickerInput]: renderNotFound prop is deprecated. Please use renderEmpty prop instead.');
                }

                return props.renderNotFound({
                    onClose: props.onClose,
                    search: search,
                });
            }

            return (
                <FlexCell cx={ css.noData } grow={ 1 } textAlign="center">
                    <Text size={ props.searchSize }>{i18n.dataPickerBody.noRecordsMessage}</Text>
                </FlexCell>
            );
        }
    };

    const getRowSize = () => {
        if (isMobile()) {
            return settings.pickerInput.sizes.body.mobileRow;
        }

        return props.size || settings.pickerInput.sizes.body.row;
    };

    const renderRow = (row: DataRowProps<TItem, TId>, dsState: DataSourceState) => {
        const pickerRowProps = { ...row, getName: props.getName };

        return props.renderRow ? (
            props.renderRow(pickerRowProps, dsState)
        ) : (
            <DataPickerRow
                { ...pickerRowProps }
                key={ row.rowKey }
                size={ getRowSize() }
                flattenSearchResults={ props.flattenSearchResults }
                highlightSearchMatches={ highlightSearchMatches }
                dataSourceState={ dsState }
                getName={ props.getName }
            />
        );
    };

    const searchSize = isMobile()
        ? settings.pickerInput.sizes.body.mobileSearchInput
        : settings.pickerInput.sizes.body.getSearchSize({ pickerSize: props.searchSize });

    const renderedDataRows = useMemo(() => props.rows.map((row) => renderRow(row, props.value)), [props.rows, props.value]);

    return (
        <>
            {showSearch && (
                <div key="search" className={ cx(css.searchWrapper, 'uui-picker_input-body-search') }>
                    <FlexCell grow={ 1 }>
                        <MoveFocusInside>
                            <SearchInput
                                placeholder={ i18n.dataPickerBody.searchPlaceholder }
                                value={ props.value.search }
                                onValueChange={ (newVal) => props.onValueChange({ ...props.value, search: newVal }) }
                                onKeyDown={ searchKeyDown }
                                size={ searchSize }
                                debounceDelay={ props.searchDebounceDelay }
                                rawProps={ {
                                    dir: 'auto',
                                    'aria-activedescendant': focusedRowId,
                                } }
                            />
                        </MoveFocusInside>
                    </FlexCell>
                </div>
            )}
            <FlexRow
                key="body"
                cx={ cx('uui-picker_input-body') }
                rawProps={ { style: { maxHeight: props.maxHeight, maxWidth: props.maxWidth }, tabIndex: -1 } }
            >
                { props.rows.length === 0 && props.value.topIndex === 0
                    // We need to also ensure that topIndex === 0, because we can have state were there is no rows but topIndex > 0, in case when we scrolled lover than we have rows
                    // we fix this state on next render and shouldn't show empty state.
                    ? renderEmpty() : (
                        <VirtualList
                            value={ props.value }
                            onValueChange={ props.onValueChange }
                            rows={ renderedDataRows }
                            rawProps={ {
                                'aria-multiselectable': props.selectionMode === 'multi' ? true : null,
                                'aria-orientation': 'vertical',
                                tabIndex: -1,
                                ...props.rawProps,
                            } }
                            rowsCount={ props.rowsCount }
                            isLoading={ props.isReloading }
                            renderBlocker={ settings.pickerInput.renderBlocker }
                            overflowTopEffect={ showSearch ? 'line' : 'none' }
                            overflowBottomEffect="line"
                        />
                    )}
            </FlexRow>
        </>
    );
}
