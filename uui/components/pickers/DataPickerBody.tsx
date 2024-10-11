import React from 'react';
import {
    Lens, DataSourceState, isMobile, cx, Overwrite, IDropdownBodyProps, devLogger,
} from '@epam/uui-core';
import { FlexCell, PickerBodyBase, PickerBodyBaseProps } from '@epam/uui-components';
import { SearchInput, SearchInputProps } from '../inputs';
import { FlexRow, VirtualList } from '../layout';
import { Text } from '../typography';
import { i18n } from '../../i18n';
import { ControlSize } from '../types';
import { settings } from '../../settings';
import css from './DataPickerBody.module.scss';

export interface DataPickerBodyModsOverride {}

interface DataPickerBodyMods {
    searchSize?: ControlSize;
}

export interface DataPickerBodyProps extends Overwrite<DataPickerBodyMods, DataPickerBodyModsOverride>, PickerBodyBaseProps, IDropdownBodyProps {
    maxHeight?: number;
    editMode?: 'dropdown' | 'modal';
    selectionMode?: 'single' | 'multi';
    maxWidth?: number;
}

export class DataPickerBody extends PickerBodyBase<DataPickerBodyProps> {
    lens = Lens.onEditableComponent<DataSourceState>(this);
    searchLens = this.lens.prop('search');
    getSearchSize = () => (isMobile() ? settings.sizes.pickerInput.body.mobile.searchInput : this.props.searchSize) as SearchInputProps['size'];

    renderEmpty() {
        const search = this.searchLens.get();

        if (this.props.renderEmpty) {
            return this.props.renderEmpty({
                minCharsToSearch: this.props.minCharsToSearch,
                onClose: this.props.onClose,
                search: search,
            });
        }

        if (this.props.minCharsToSearch && search.length < this.props.minCharsToSearch) {
            return (
                <FlexCell cx={ css.noData } grow={ 1 } textAlign="center">
                    <Text size={ this.props.searchSize }>{i18n.dataPickerBody.typeSearchToLoadMessage}</Text>
                </FlexCell>
            );
        }

        if (this.props.rows.length === 0) {
            if (this.props.renderNotFound) {
                if (__DEV__) {
                    devLogger.warn('[PickerInput]: renderNotFound prop is deprecated. Please use renderEmpty prop instead.');
                }

                return this.props.renderNotFound({
                    onClose: this.props.onClose,
                    search: this.searchLens.get(),
                });
            }

            // Default no record found message for 'NOT_FOUND' and "NO_RECORDS" reason
            // TODO: make separate messages for 'NOT_FOUND' and "NO_RECORDS" reason
            return (
                <FlexCell cx={ css.noData } grow={ 1 } textAlign="center">
                    <Text size={ this.props.searchSize }>{i18n.dataPickerBody.noRecordsMessage}</Text>
                </FlexCell>
            );
        }
    }

    render() {
        const searchSize = this.getSearchSize();
        return (
            <>
                {this.showSearch() && (
                    <div key="search" className={ css.searchWrapper }>
                        <FlexCell grow={ 1 }>
                            <SearchInput
                                ref={ this.searchRef }
                                placeholder={ i18n.dataPickerBody.searchPlaceholder }
                                { ...this.searchLens.toProps() }
                                onKeyDown={ this.searchKeyDown }
                                size={ searchSize }
                                debounceDelay={ this.props.searchDebounceDelay }
                                rawProps={ { dir: 'auto' } }
                            />
                        </FlexCell>
                    </div>
                )}
                <FlexRow key="body" cx={ cx('uui-picker_input-body', css[this.props.editMode], css[this.props.selectionMode]) } rawProps={ { style: { maxHeight: this.props.maxHeight, maxWidth: this.props.maxWidth } } }>
                    { this.props.rows.length > 0 ? (
                        <VirtualList
                            { ...this.lens.toProps() }
                            rows={ this.props.rows }
                            rawProps={ this.props.rawProps }
                            rowsCount={ this.props.rowsCount }
                            isLoading={ this.props.isReloading }
                        />
                    ) : this.renderEmpty()}
                </FlexRow>
            </>
        );
    }
}
