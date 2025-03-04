import * as React from 'react';
import { isEventTargetInsideClickable, uuiMarkers, uuiMod } from '@epam/uui-core';
import type { DataRowProps } from '@epam/uui-core';
import cx from 'classnames';

import css from './DataPickerRow.module.scss';

interface DataPickerRowProps<TItem, TId> extends DataRowProps<TItem, TId> {
    renderContent: () => React.ReactNode;
}

export class DataPickerRow<TItem, TId> extends React.Component<DataPickerRowProps<TItem, TId>> {
    rowNode = React.createRef<HTMLDivElement>();
    componentDidMount() {
        if (this.props.onFocus) {
            this.rowNode.current?.addEventListener('mouseenter', this.handleMouseEnter);
        }
    }

    componentWillUnmount() {
        this.rowNode.current?.removeEventListener('mouseenter', this.handleMouseEnter);
    }

    handleMouseEnter = () => {
        this.props.onFocus && this.props.onFocus(this.props.index);
    };

    render() {
        const clickHandler = this.props.onClick || this.props.onSelect || this.props.onFold || this.props.onCheck;

        return (
            <div
                onClick={ clickHandler && ((e) => !isEventTargetInsideClickable(e) && clickHandler(this.props)) }
                role="option"
                aria-busy={ this.props.isLoading }
                aria-posinset={ this.props.index + 1 }
                aria-checked={ this.props.checkbox?.isVisible ? this.props.isChecked : null }
                aria-selected={ this.props.isSelectable ? this.props.isSelected : null }
                { ...this.props.rawProps }
                ref={ this.rowNode }
                className={ cx(
                    css.root,
                    clickHandler && this.props.isFocused && uuiMod.focus,
                    clickHandler && uuiMarkers.clickable,
                    this.props.cx,
                ) }
            >
                {this.props.renderContent()}
            </div>
        );
    }
}
