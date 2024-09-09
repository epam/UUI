import * as React from 'react';
import isEqual from 'react-fast-compare';

import {
    DataSourceListProps, DataSourceState, IEditable, IHasRawProps, isMobile,
} from '@epam/uui-core';

export interface PickerBodyBaseProps extends DataSourceListProps, IEditable<DataSourceState>, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    onKeyDown?(e: React.KeyboardEvent<HTMLElement>): void;
    renderNotFound?: () => React.ReactNode;
    renderTypeSearchToLoadItems?: () => React.ReactNode;
    rows: React.ReactNode[];
    scheduleUpdate?: () => void;
    search: IEditable<string>;
    showSearch?: boolean | 'auto';
    fixedBodyPosition?: boolean;
    searchDebounceDelay?: number;
    notEnoughTokensToLoadData?: boolean;
}

export abstract class PickerBodyBase<TProps extends PickerBodyBaseProps> extends React.Component<TProps> {
    needFocusSearch = this.showSearch();
    searchRef = React.createRef<HTMLInputElement>();

    componentDidUpdate(prevProps: PickerBodyBaseProps) {
        // Focusing of searchInput is done via ref.focus(), but not via autoFocus on SearchInput,
        // because otherwise, after body close, focus on PickerToggler is lost and on  press Tab, it is moved to document.body.
        if (this.needFocusSearch && !isMobile()) {
            this.searchRef.current?.focus({ preventScroll: true });
            this.needFocusSearch = false;
        }

        if (prevProps.rows.length !== this.props.rows.length || (!isEqual(prevProps.value.checked, this.props.value.checked) && !this.props.fixedBodyPosition)) {
            this.props.scheduleUpdate?.();
        }
    }

    showSearch() {
        return this.props.showSearch === 'auto' ? this.props.totalCount > 10 : Boolean(this.props.showSearch);
    }

    searchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        this.props.onKeyDown?.(e);
        if (e.shiftKey && e.key === 'Tab') e.preventDefault();
    };
}
