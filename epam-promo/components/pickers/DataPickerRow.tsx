import * as React from 'react';
import * as ReactDOM from 'react-dom';
import isEqual from 'lodash.isequal';
import { DataRowProps, DataColumnProps, FlexRowProps, uuiMod, uuiMarkers } from '@epam/uui';
import { FlexRow } from '@epam/uui-components';
import { IconButton, FlexSpacer, DataTableCell } from '../';
import * as css from './DataPickerRow.scss';
import * as tickIcon_24 from '@epam/assets/icons/common/notification-done-24.svg';
import * as tickIcon_18 from '@epam/assets/icons/common/notification-done-18.svg';
import * as tickIcon_12 from '@epam/assets/icons/common/notification-done-12.svg';

export interface DataPickerRowProps<TItem, TId> extends DataRowProps<TItem, TId> {
    renderItem(item: TItem, rowProps: DataRowProps<TItem, TId>): React.ReactNode;
    padding?: '12' | '24';
    size?: 'none' | '24' | '30' | '36' | '42' | '48' | '60';
    borderBottom?: 'none' | 'gray20';
}

export class DataPickerRow<TItem, TId> extends React.Component<DataPickerRowProps<TItem, TId>> {

    private getIcon = (size: string) => {
        switch (size) {
            case '24': return tickIcon_12;
            case '30': return tickIcon_18;
            case '36': return tickIcon_18;
            case '42': return tickIcon_24;
            default: return tickIcon_18;
        }
    }

    rowNode: React.RefObject<any> = React.createRef();
    rowDOMNode: Element | Text = null;

    column: DataColumnProps<TItem> =
        {
            key: 'name',
            grow: 1,
            render: (item, rowProps) => <div key={ rowProps.id }  className={ css.renderItem }>
                { this.props.renderItem(item, rowProps) }
                <FlexSpacer />
                { (rowProps.isChildrenSelected || rowProps.isSelected) && <div className={ css.iconWrapper }>
                    <IconButton icon={ this.getIcon(this.props.size) } color={ rowProps.isChildrenSelected ? 'gray60' : 'blue' } />
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
                padding={ this.props.padding || '24' }
                isFirstColumn={ true }
                isLastColumn={ false }
                column={ this.column }
                rowProps={ this.props }
            />
        </FlexRow>;
    }
}
