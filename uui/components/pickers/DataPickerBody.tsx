import React from 'react';
import {
    Lens, DataSourceState, isMobile, cx, Overwrite,
    PickerEmptyBodyReason,
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

export interface DataPickerBodyProps extends Overwrite<DataPickerBodyMods, DataPickerBodyModsOverride>, PickerBodyBaseProps {
    maxHeight?: number;
    editMode?: 'dropdown' | 'modal';
    selectionMode?: 'single' | 'multi';
    maxWidth?: number;
}

export class DataPickerBody extends PickerBodyBase<DataPickerBodyProps> {
    lens = Lens.onEditableComponent<DataSourceState>(this);
    searchLens = this.lens.prop('search');
    getSearchSize = () => (isMobile() ? settings.sizes.pickerInput.body.mobile.searchInput : this.props.searchSize) as SearchInputProps['size'];

    renderNotFound() {
        if (this.props.renderNotFound) {
            return this.props.renderNotFound();
        }

        return (
            <FlexCell cx={ css.noData } grow={ 1 } textAlign="center">
                <Text size={ this.props.searchSize }>{i18n.dataPickerBody.noRecordsMessage}</Text>
            </FlexCell>
        );
    }

    renderEmpty(reason: PickerEmptyBodyReason) {
        if (this.props.renderEmpty) {
            return this.props.renderEmpty(reason);
        }

        if (reason === 'not-found-records') {
            return this.renderNotFound();
        }

        if (reason === 'less-than-min-chars-to-search') {
            return (
                <FlexCell cx={ css.noData } grow={ 1 } textAlign="center">
                    <Text size={ this.props.searchSize }>{i18n.dataPickerBody.typeSearchToLoadMessage}</Text>
                </FlexCell>
            );
        }
        return null;
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
                    { this.props.notEnoughTokensToLoadData
                        ? this.renderEmpty('less-than-min-chars-to-search')
                        : null }
                    { !this.props.notEnoughTokensToLoadData && (this.props.rowsCount > 0 ? (
                        <VirtualList
                            { ...this.lens.toProps() }
                            rows={ this.props.rows }
                            rawProps={ this.props.rawProps }
                            rowsCount={ this.props.rowsCount }
                            isLoading={ this.props.isReloading }
                        />
                    ) : (this.renderEmpty('not-found-records')))}
                </FlexRow>
            </>
        );
    }
}
