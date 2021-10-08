import { Component, ReactNode, KeyboardEvent } from 'react';
import { findDOMNode } from 'react-dom';
import isEqual from 'lodash.isequal';
import { DataSourceListProps, DataSourceState, IEditable, IHasRawProps, isMobile } from '@epam/uui';

export interface PickerBodyBaseProps extends DataSourceListProps, IEditable<DataSourceState>, IHasRawProps<HTMLDivElement> {
    onKeyDown?(e: KeyboardEvent<HTMLElement>): void;
    renderNotFound?: () => ReactNode;
    rows: ReactNode[];
    scheduleUpdate?: () => void;
    search: IEditable<string>;
    showSearch?: boolean | 'auto';
}

export abstract class PickerBodyBase<TProps extends PickerBodyBaseProps> extends Component<TProps, unknown> {
    needFocusSearch: boolean = this.showSearch();

    componentDidUpdate(prevProps: PickerBodyBaseProps) {
        if (this.needFocusSearch  && !isMobile()) {
            let body = findDOMNode(this) as HTMLElement;
            body && body.getElementsByTagName('input')[0]?.focus({ preventScroll: true });
            this.needFocusSearch = false;
        }
        if (prevProps.rows.length !== this.props.rows.length || !isEqual(prevProps.value.checked, this.props.value.checked)) {
            this.props.scheduleUpdate && this.props.scheduleUpdate();
        }
    }

    showSearch(): boolean {
        let showSearch = this.props.showSearch;
        if (showSearch === 'auto') {
            showSearch = this.props.totalCount > 10;
        }

        return showSearch as boolean;
    }

    searchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        this.props.onKeyDown && this.props.onKeyDown(e);
        if (e.shiftKey && e.key === 'Tab') e.preventDefault();
    }
}