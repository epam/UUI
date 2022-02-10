import * as React from 'react';
import * as ReactDOM from 'react-dom';
import isEqual from 'lodash.isequal';
import { DataRowProps, FlexRowProps, uuiMod } from '@epam/uui-core';
import { FlexRow } from '../index';

interface DataPickerRowProps<TItem, TId> extends DataRowProps<TItem, TId> {
    renderContent: () => React.ReactNode;
}

export class DataPickerRow<TItem, TId> extends React.Component<DataPickerRowProps<TItem, TId>> {
    rowNode: React.RefObject<any> = React.createRef();
    rowDOMNode: Element | Text = null;

    componentDidMount() {
        this.rowDOMNode = ReactDOM.findDOMNode(this.rowNode.current);
        if (this.props.onFocus) {
            this.rowDOMNode?.addEventListener('mouseenter', this.handleMouseEnter);
        }
    }

    componentWillUnmount() {
        this.rowDOMNode?.removeEventListener('mouseenter', this.handleMouseEnter);
    }

    handleMouseEnter = () => {
        this.props.onFocus(this.props.index);
    }

    shouldComponentUpdate(nextProps: DataRowProps<TItem, TId> & FlexRowProps) {
        const eq = isEqual(this.props, nextProps);
        return !eq;
    }

    render() {
        const clickHandler = this.props.onSelect || this.props.onFold || this.props.onCheck;
        return <FlexRow
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
            { this.props.renderContent() }
        </FlexRow>;
    }
}