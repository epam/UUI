import { DataRowProps, DataColumnProps, FlexRowProps, uuiMod, uuiMarkers } from '@epam/uui';
import React from 'react';
import * as ReactDOM from 'react-dom';
import isEqual from 'lodash.isequal';
import * as css from './DataPickerRow.scss';
import { DataTableRowMods } from '../tables';
import { IconButton } from '../buttons';
import * as tickIcon from '../icons/notification-done-18.svg';
import * as smallSizeIcon from '../icons/notification-done-12.svg';
import { FlexSpacer } from '../layout';
import { FlexRow } from '@epam/uui-components';
import { DataTableCell } from '../tables';

export interface DataPickerRowProps<TItem, TId> extends DataRowProps<TItem, TId>, DataTableRowMods {
    renderItem(item: TItem, rowProps: DataRowProps<TItem, TId>): React.ReactNode;
}

export class DataPickerRow<TItem, TId> extends React.Component<DataPickerRowProps<TItem, TId>> {

    rowNode: React.RefObject<any> = React.createRef();
    rowDOMNode: Element | Text = null;

    column: DataColumnProps<TItem> =
        {
            key: 'name',
            grow: 1,
            render: (item, rowProps) => <div key={ rowProps.id } className={ css.renderItem }>
                { this.props.renderItem(item, rowProps) }
                <FlexSpacer />
                { (rowProps.isChildrenSelected || rowProps.isSelected) && <div className={ css.iconWrapper }>
                    <IconButton icon={ this.props.size === '24' ? smallSizeIcon : tickIcon } color={ rowProps.isChildrenSelected ? 'night400' : 'sky' } />
                </div> }
            </div>,
        };

    componentDidMount() {
        this.rowDOMNode = ReactDOM.findDOMNode(this.rowNode.current);
        if (this.props.onFocus) {
            this.rowDOMNode?.addEventListener('mouseenter', this.handleMouseEnter);
        }
    }

    componentWillUnmount() {
        this.rowDOMNode?.removeEventListener('mouseenter', this.handleMouseEnter);
    }

    handleMouseEnter = (e: any) => {
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
            rawProps={ this.props.rawProps }
            ref={ this.rowNode }
            cx={ [
                css.pickerRow,
                clickHandler && uuiMarkers.clickable,
                clickHandler && this.props.isFocused && uuiMod.focus,
                this.props.cx,
            ] }
        >
            <DataTableCell
                key='name'
                size={ this.props.size || '36' }
                padding={ this.props.padding || '12' }
                isFirstColumn={ true }
                isLastColumn={ false }
                column={ this.column }
                rowProps={ this.props }
            />
        </FlexRow>;
    }
}
