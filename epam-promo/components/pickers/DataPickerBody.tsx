import * as React from 'react';
import { Lens, DataSourceState, isMobile, cx } from '@epam/uui-core';
import { FlexCell, PickerBodyBase, PickerBodyBaseProps } from '@epam/uui-components';
import { SearchInput } from '../inputs';
import { FlexRow, VirtualList } from '../layout';
import { i18n } from '../../i18n';
import { ControlSize } from '../types';
import css from './DataPickerBody.scss';
import { Text } from "../typography";

export interface DataPickerBodyProps extends PickerBodyBaseProps {
    maxHeight?: number;
    editMode?: 'dropdown' | 'modal';
    searchSize?: ControlSize;
}

export class DataPickerBody extends PickerBodyBase<DataPickerBodyProps> {
    lens = Lens.onEditableComponent<DataSourceState>(this);
    searchLens = this.lens.prop('search');

    renderNoFound() {
        return (
            <FlexCell cx={ css[`no-found-size-${ this.props.searchSize || 36 }`] } grow={ 1 } textAlign='center'>
                { this.props.renderNotFound ?
                    this.props.renderNotFound() :
                    <Text size={ this.props.searchSize || '36' }>{ i18n.dataPickerBody.noRecordsMessage }</Text>
                }
            </FlexCell>
        );
    }

    render() {
        const searchSize = isMobile() ? '48' : (this.props.searchSize || '36');
        const searchClass = cx(css.searchWrapper, css[`search-size-${ searchSize }`]);

        return <>
            { this.showSearch() && (
                <div key='search' className={ searchClass }>
                    <FlexCell grow={ 1 }>
                        <SearchInput
                            ref={ this.searchRef }
                            cx={ css.search }
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
                cx={ cx(css.body, css['editMode-' + this.props.editMode]) }
                rawProps={ { style: { maxHeight: this.props.maxHeight } } }
                background='white'
            >
                { this.props.rowsCount > 0
                    ? <VirtualList
                        { ...this.lens.toProps() }
                        rows={ this.props.rows }
                        role='listbox'
                        rawProps={ this.props.rawProps }
                        rowsCount={ this.props.rowsCount }
                    />
                    : this.renderNoFound()
                }
            </FlexRow>
        </>;
    }
}
