import React from 'react';
import ReactDOM from 'react-dom';
import isEqual from 'lodash.isequal';
import css from './DataPickerBody.scss';
import cx from 'classnames';
import { Lens, DataSourceState, IEditable, DataSourceListProps, isMobile } from '@epam/uui';
import { FlexCell } from '@epam/uui-components';
import { i18n } from "../../i18n";
import * as types from '../types';
import { SearchInput } from '../inputs';
import { FlexRow, VirtualList } from '../layout';
import { Text } from '../typography';

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
            body && body.getElementsByTagName('input')[0].focus({ preventScroll: true });
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

        return <FlexCell grow={ 1 } textAlign="center">
            <Text>{ i18n.dataPickerBody.noResultsMessage }</Text>
        </FlexCell>;
    }

    render() {
        const value = this.props.value;
        const searchSize = isMobile() ? "48" : (this.props.searchSize || "36");
        const searchClass = cx(css.searchWrapper, css[`search-size-${ searchSize }`]);

        return <>
            { this.showSearch() && (
                <div key="search" className={ searchClass }>
                    <FlexCell grow={ 1 }>
                        <SearchInput
                            cx={ css.search }
                            placeholder={ i18n.dataPickerBody.searchPlaceholder }
                            { ...this.searchLens.toProps() }
                            onKeyDown={ this.props.onKeyDown }
                            size={ searchSize }
                        />
                    </FlexCell>
                </div>
            ) }
            <FlexRow
                key="body"
                cx={ css.body }
                rawProps={ { style: { maxHeight: this.props.maxHeight } } }
                background="white"
            >
                { this.props.rowsCount > 0
                    ? <VirtualList
                        { ...this.lens.toProps() }
                        shadow="white"
                        role="listbox"
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
