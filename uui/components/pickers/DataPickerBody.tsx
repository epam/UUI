import React from 'react';
import {
    Lens, DataSourceState, isMobile, cx,
} from '@epam/uui-core';
import { FlexCell, PickerBodyBase, PickerBodyBaseProps } from '@epam/uui-components';
import { SearchInput } from '../inputs';
import { FlexRow, VirtualList } from '../layout';
import { Text } from '../typography';
import { i18n } from '../../i18n';
import { ControlSize } from '../types';
import css from './DataPickerBody.module.scss';

export interface DataPickerBodyProps extends PickerBodyBaseProps {
    maxHeight?: number;
    editMode?: 'dropdown' | 'modal';
    searchSize?: ControlSize;
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

        return (
            <FlexCell cx={ css[`no-found-size-${this.props.searchSize || 36}`] } grow={ 1 } textAlign="center">
                <Text size={ this.props.searchSize || '36' }>{i18n.dataPickerBody.noRecordsMessage}</Text>
            </FlexCell>
        );
    }

    render() {
        const searchSize = isMobile() ? '48' : this.props.searchSize || '36';

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
                                autoFocus={ this.showSearch() && !isMobile() }
                            />
                        </FlexCell>
                    </div>
                )}
                <FlexRow key="body" cx={ cx(css.body, css[this.props.editMode], css[this.props.selectionMode]) } rawProps={ { style: { maxHeight: this.props.maxHeight, maxWidth: this.props.maxWidth } } }>
                    { this.props.rowsCount > 0 ? (
                        <VirtualList 
                            { ...this.lens.toProps() }
                            rows={ this.props.rows }
                            rawProps={ this.props.rawProps }
                            rowsCount={ this.props.rowsCount }
                            isLoading={ this.props.isReloading }
                        />
                    ) : (this.renderNotFound())}
                </FlexRow>
            </>
        );
    }
}
