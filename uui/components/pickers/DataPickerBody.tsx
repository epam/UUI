import React from 'react';
import {
    Lens, DataSourceState, isMobile, cx, Overwrite,
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
    renderNotFound() {
        if (this.props.renderNotFound) {
            return this.props.renderNotFound();
        }

        // TODO: need fix sizes, how to use variables
        return (
            <FlexCell cx={ css[`no-found-size-${this.props.searchSize || settings.sizes.dataPickerBody.flexCell.default}`] } grow={ 1 } textAlign="center">
                <Text size={ this.props.searchSize }>{i18n.dataPickerBody.noRecordsMessage}</Text>
            </FlexCell>
        );
    }

    renderTypeSearchToLoadItems() {
        if (this.props.renderTypeSearchToLoadItems) {
            return this.props.renderTypeSearchToLoadItems();
        }
        // TODO: need fix sizes, how to use variables
        return (
            <FlexCell cx={ css[`type-search-to-load-size-${this.props.searchSize || settings.sizes.dataPickerBody.flexCell.default}`] } grow={ 1 } textAlign="center">
                <Text size={ this.props.searchSize }>{i18n.dataPickerBody.typeSearchToLoadMessage}</Text>
            </FlexCell>
        );
    }

    render() {
        const searchSize = (isMobile() ? settings.sizes.dataPickerBody.searchInput['mobile'] : this.props.searchSize) as SearchInputProps['size'];

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
                <FlexRow key="body" cx={ cx('uui-pickerInput-body', css[this.props.editMode], css[this.props.selectionMode]) } rawProps={ { style: { maxHeight: this.props.maxHeight, maxWidth: this.props.maxWidth } } }>
                    { this.props.notEnoughTokensToLoadData
                        ? this.renderTypeSearchToLoadItems()
                        : null }
                    { !this.props.notEnoughTokensToLoadData && (this.props.rowsCount > 0 ? (
                        <VirtualList
                            { ...this.lens.toProps() }
                            rows={ this.props.rows }
                            rawProps={ this.props.rawProps }
                            rowsCount={ this.props.rowsCount }
                            isLoading={ this.props.isReloading }
                        />
                    ) : (this.renderNotFound()))}
                </FlexRow>
            </>
        );
    }
}
