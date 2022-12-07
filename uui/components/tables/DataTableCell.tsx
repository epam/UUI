import * as React from 'react';
import { cx, uuiMarkers, DataTableCellProps } from '@epam/uui-core';
import { IconContainer, DragHandle } from '@epam/uui-components';
import { DataTableCellMods } from './types';
import { TextPlaceholder, Text } from '../typography';
import { FlexCell } from '../layout';
import { Checkbox } from '../inputs';
import { ReactComponent as FoldingArrow } from '../../icons/tree_folding_arrow.svg';
import css from './DataTableCell.scss';

export class DataTableCell<TItem, TId, TCellValue> extends React.Component<DataTableCellProps<TItem, TId, TCellValue> & DataTableCellMods> {
    hasDepsWidgets = !!(this.props.rowProps?.checkbox?.isVisible || this.props.rowProps?.indent);

    isDraggable = () => !!this.props.rowProps?.dnd?.srcData;

    getContent = () => {
        const row = this.props.rowProps;
        const additionalItemSize = +this.props.size < 30 ? '12' : '18';
        const cellContent = row.isLoading
            ? <Text size={ this.props.size != '60' ? this.props.size : '48' }><TextPlaceholder /></Text>
            : this.props.column.render(this.props.rowProps.value, this.props.rowProps);

        return (
            <>
                { this.props.isFirstColumn && this.isDraggable() && <DragHandle cx={ css.dragHandle } /> }
                { this.props.isFirstColumn && row?.checkbox?.isVisible && <Checkbox
                    key='cb'
                    cx={ css.checkbox }
                    tabIndex={ this.props.tabIndex }
                    size={ additionalItemSize }
                    value={ row.isChecked }
                    indeterminate={ !row.isChecked && row.isChildrenChecked }
                    onValueChange={ () => row.onCheck(row) }
                    isDisabled={ row.checkbox.isDisabled }
                    isInvalid={ row.checkbox.isInvalid }
                />
                }
                { this.props.isFirstColumn && row.indent > 0 && (
                    <div key='fold' className={ css.indent } style={ { marginLeft: (row.indent - 1) * 24 } }>
                        { row.isFoldable &&
                            <IconContainer
                                key='icon'
                                icon={ FoldingArrow }
                                cx={ [css.foldingArrow, css[`folding-arrow-${additionalItemSize}`], uuiMarkers.clickable] }
                                rotate={ row.isFolded ? '90ccw' : '0' }
                                onClick={ () => row.onFold(row) }
                            />
                        }
                    </div>
                ) }
                { cellContent }
            </>
        );
    }

    render() {
        return (
            <FlexCell
                { ...this.props.column }
                rawProps={ { role: 'cell' } }
                cx={ cx(
                    css.cell,
                    this.props.isFirstColumn && this.hasDepsWidgets && css.wrapper,
                    css['size-' + (this.props.size || '36')],
                    css[`padding-${ this.props.padding || '12' }`],
                    this.props.isFirstColumn && css[`padding-left-${ this.props.padding || '24' }`],
                    this.props.isLastColumn && css['padding-right-24'],
                    this.props.column.cx,
                    css[`align-widgets-${ this.props.alignActions || 'top' }`],
                ) }>
                { this.getContent() }
            </FlexCell>
        );
    }
}
