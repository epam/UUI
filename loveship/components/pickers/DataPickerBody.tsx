import * as React from 'react';
import { Lens, DataSourceState, isMobile, cx } from '@epam/uui-core';
import { FlexCell, PickerBodyBase, PickerBodyBaseProps } from '@epam/uui-components';
import { FlexRow, VirtualList } from '../layout';
import { Text } from '../typography';
import { i18n } from '../../i18n';
import { ControlSize } from '../types';
import css from './DataPickerBody.scss';
import { SearchInput } from '../inputs';

export type DataPickerBodyProps = PickerBodyBaseProps & {
    maxHeight?: number;
    editMode?: 'dropdown' | 'modal';
    searchSize?: ControlSize;
};

export class DataPickerBody extends PickerBodyBase<DataPickerBodyProps> {
    lens = Lens.onEditableComponent<DataSourceState>(this);
    searchLens = this.lens.prop('search');

    renderNoFound() {
        if (this.props.renderNotFound) return this.props.renderNotFound();
        return (
            <FlexCell cx={ css[`no-found-size-${ this.props.searchSize || 36 }`] } grow={ 1 } textAlign='center'>
                <Text>{ i18n.dataPickerBody.noResultsMessage }</Text>
            </FlexCell>
        );
    }

    render() {
        const value = this.props.value;
        const searchSize = isMobile() ? '48' : (this.props.searchSize || '36');
        const searchClass = cx(css.searchWrapper, css[`search-size-${ searchSize }`]);

        return <>
            { this.showSearch() && (
                <div key='search' className={ searchClass }>
                    <FlexCell grow={ 1 }>
                        <SearchInput
                            cx={ css.search }
                            ref={ this.searchRef }
                            placeholder={ i18n.dataPickerBody.searchPlaceholder }
                            { ...this.searchLens.toProps() }
                            onKeyDown={ this.searchKeyDown }
                            size={ searchSize }
                        />
                    </FlexCell>
                </div>
            ) }
            <FlexRow
                key='body'
                cx={ css.body }
                rawProps={ { style: { maxHeight: this.props.maxHeight } } }
                background='white'
            >
                { this.props.rowsCount > 0
                    ? <VirtualList
                        { ...this.lens.toProps() }
                        role="listbox"
                        rows={ this.props.rows }
                        rowsCount={ this.props.rowsCount }
                        rawProps={ this.props.rawProps }
                    />
                    : this.renderNoFound()
                }
            </FlexRow>
        </>;
    }
}
