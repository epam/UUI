import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as css from './DataPickerBody.scss';
import * as types from '../types';
import cx from 'classnames';
import { SearchInput } from '../inputs';
import { FlexRow, VirtualList } from '../layout';
import { Lens, DataSourceState, IEditable, DataSourceListProps } from '@epam/uui';
import { FlexCell } from '@epam/uui-components';
import { Text } from '../typography';
import isEqual from 'lodash.isequal';
import { i18n } from "../../i18n";

export type DataPickerBodyProps<TItem, TId> = DataSourceListProps & IEditable<DataSourceState> & {
    showSearch?: boolean | 'auto'
    showSelectedRows?: boolean;
    maxHeight?: number;
    rows: React.ReactNode[];
    renderNotFound?: () => React.ReactNode;
    editMode?: 'dropdown' | 'modal';
    onKeyDown?(e: React.KeyboardEvent<HTMLElement>): void;
    scheduleUpdate?: () => void;
    searchSize?: types.ControlSize;
    search: IEditable<string>;
};

export class DataPickerBody<TItem, TId> extends React.Component<DataPickerBodyProps<TItem, TId>, any> {
    lens = Lens.onEditableComponent<DataSourceState>(this);
    searchLens = this.lens.prop('search');
    needFocusSearch: boolean = this.showSearch();


    componentDidUpdate(prevProps: DataPickerBodyProps<TItem, TId>) {
        if (this.needFocusSearch) {
            let body = ReactDOM.findDOMNode(this) as HTMLElement;
            body && body.getElementsByTagName('input')[0].focus({preventScroll: true});
            this.needFocusSearch = false;
        }
        if (prevProps.rows.length !== this.props.rows.length || !isEqual(prevProps.value.checked, this.props.value.checked)) {
            this.props.scheduleUpdate && this.props.scheduleUpdate();
        }
    }

    showSearch() {
        let showSearch = this.props.showSearch;
        if (showSearch === 'auto') {
            showSearch = this.props.totalCount > 10;
        }

        return showSearch;
    }

    renderNoFound() {
        if (this.props.renderNotFound) {
            return this.props.renderNotFound();
        }

        return <FlexCell cx={ css[`no-found-size-${ this.props.searchSize || 36 }`] } grow={ 1 } textAlign='center'>
           <Text size={ this.props.searchSize || '36' }>{ i18n.dataPickerBody.noRecordsMessage }</Text>
        </FlexCell>;
    }

    render() {
        const value = this.props.value;

        return <>
            { this.showSearch() && <div key='search' className={ cx(css.searchWrapper, css[`search-size-${ this.props.searchSize || 36 }`]) }>
                <FlexCell grow={ 1 }>
                    <SearchInput
                        cx={ css.search }
                        placeholder={ i18n.dataPickerBody.searchPlaceholder }
                        { ...this.searchLens.toProps() }
                        onKeyDown={ this.props.onKeyDown }
                        size={ this.props.searchSize || '36' }
                    />
                </FlexCell>
            </div> }
            <FlexRow
                key='body'
                cx={ cx(css.body, css[this.props.editMode]) }
                rawProps={ {style: { maxHeight: this.props.maxHeight }} }
                borderBottom={ this.props.showSelectedRows && value?.checked ? 'gray40' : false }
                background='white'
            >
                { this.props.rowsCount > 0
                    ? <VirtualList
                        { ...this.lens.toProps() }
                        shadow={ false }
                        rows={ this.props.rows }
                        rowsCount={ this.props.rowsCount }
                        focusedIndex={ value && value.focusedIndex || 0 }
                    />
                    : this.renderNoFound()
                }
            </FlexRow>
        </>;
    }
}
