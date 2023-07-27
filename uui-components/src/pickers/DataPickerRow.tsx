import * as React from 'react';
import { DataRowProps, uuiMod } from '@epam/uui-core';
import { FlexRow } from '../index';

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
            <FlexRow
                onClick={ clickHandler && (() => clickHandler(this.props)) }
                rawProps={ {
                    role: 'option',
                    'aria-posinset': this.props.index + 1,
                    ...(this.props.checkbox?.isVisible && { 'aria-checked': this.props.isChecked }),
                    ...(this.props.isSelectable && { 'aria-selected': this.props.isSelected }),
                    ...this.props.rawProps,
                } }
                ref={ this.rowNode }
                cx={ [clickHandler && this.props.isFocused && uuiMod.focus, this.props.cx] }
            >
                {this.props.renderContent()}
            </FlexRow>
        );
    }
}
