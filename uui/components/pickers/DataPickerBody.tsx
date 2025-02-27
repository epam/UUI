import React, { useEffect, useRef } from 'react';
import {
    DataSourceState, isMobile, cx, Overwrite, IDropdownBodyProps, devLogger, DataSourceListProps, IEditable,
    IHasRawProps, PickerInputBaseProps, usePrevious,
} from '@epam/uui-core';
import { FlexCell } from '@epam/uui-components';
import { SearchInput, SearchInputProps } from '../inputs';
import { FlexRow, VirtualList } from '../layout';
import { Text } from '../typography';
import { i18n } from '../../i18n';
import type { ControlSize } from '../types';
import { settings } from '../../settings';

import css from './DataPickerBody.module.scss';
import isEqual from 'react-fast-compare';

export interface DataPickerBodyModsOverride {}

interface DataPickerBodyMods {
    searchSize?: ControlSize;
}

export interface DataPickerBodyProps extends Overwrite<DataPickerBodyMods, DataPickerBodyModsOverride>,
    DataSourceListProps, IEditable<DataSourceState>, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IDropdownBodyProps,
    Pick<PickerInputBaseProps<any, any>, 'minCharsToSearch' | 'renderEmpty' | 'renderNotFound' | 'fixedBodyPosition' | 'searchDebounceDelay'> {
    maxHeight?: number;
    editMode?: 'dropdown' | 'modal';
    selectionMode?: 'single' | 'multi';
    maxWidth?: number;
    onKeyDown?(e: React.KeyboardEvent<HTMLElement>): void;
    rows: React.ReactNode[];
    scheduleUpdate?: () => void;
    search: IEditable<string>;
    showSearch?: boolean | 'auto';
}

export function DataPickerBody(props:DataPickerBodyProps) {
    const prevProps = usePrevious(props);

    const showSearch = props.showSearch === 'auto' ? props.totalCount > 10 : Boolean(props.showSearch);

    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (showSearch && !isMobile()) {
            searchRef.current?.focus({ preventScroll: true });
        }
    }, [showSearch]);

    useEffect(() => {
        if (props.rows.length !== prevProps?.rows.length || (!isEqual(prevProps?.value.checked, props.value.checked) && !props.fixedBodyPosition)) {
            props.scheduleUpdate?.();
        }
    }, [props.rows, prevProps, props.value.checked, props.fixedBodyPosition]);

    const searchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        props.onKeyDown?.(e);
        if (e.shiftKey && e.key === 'Tab') e.preventDefault();
    };

    const renderEmpty = () => {
        const search = props.search.value;

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

    const searchSize = isMobile() ? settings.pickerInput.sizes.body.mobileSearchInput as SearchInputProps['size'] : props.searchSize;
    return (
        <>
            {showSearch && (
                <div key="search" className={ css.searchWrapper }>
                    <FlexCell grow={ 1 }>
                        <SearchInput
                            ref={ searchRef }
                            placeholder={ i18n.dataPickerBody.searchPlaceholder }
                            value={ props.search.value }
                            onValueChange={ props.search.onValueChange }
                            onKeyDown={ searchKeyDown }
                            size={ searchSize }
                            debounceDelay={ props.searchDebounceDelay }
                            rawProps={ { dir: 'auto' } }
                        />
                    </FlexCell>
                </div>
            )}
            <FlexRow key="body" cx={ cx('uui-picker_input-body', css[props.editMode], css[props.selectionMode]) } rawProps={ { style: { maxHeight: props.maxHeight, maxWidth: props.maxWidth } } }>
                { props.rows.length === 0 && props.value.topIndex === 0
                    ? renderEmpty() : (
                        <VirtualList
                            value={ props.value }
                            onValueChange={ props.onValueChange }
                            rows={ props.rows }
                            rawProps={ props.rawProps }
                            rowsCount={ props.rowsCount }
                            isLoading={ props.isReloading }
                        />
                    )}
            </FlexRow>
        </>
    );
}
