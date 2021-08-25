import * as React from 'react';
import { cx, uuiMarkers } from '@epam/uui';
import { IconContainer, DragHandle } from '@epam/uui-components';
import { DataTableCellMods, DataTableCellProps } from './types';
import { TextPlaceholder, Text } from '../typography';
import { FlexCell } from '../layout';
import { Checkbox } from '../inputs';
import * as css from './DataTableCell.scss';
import * as foldingArrow from '../../icons/tree_folding_arrow.svg';

export type ItemsForRender = {
    component: React.ReactNode;
    widthCost: number;
};

export class DataTableCell extends React.Component<DataTableCellProps<any, any> & DataTableCellMods, {}> {
    getCellPadding = () => {
        if (this.props.padding) {
            return +this.props.padding;
        }
        return +this.props.size < 30 ? 18 : 24;
    }

    render() {
        const row = this.props.rowProps;
        let cellContent = row.isLoading
            ? <Text size={ this.props.size != '60' ? this.props.size : '48' }><TextPlaceholder /></Text>
            : this.props.column.render(this.props.rowProps.value, this.props.rowProps);


        let reusablePadding = this.props.reusePadding === 'false' ? 0 : this.getCellPadding(); // how much padding we can reuse for addon widgets. !Temporary left value from old design!
        const addonWidgets = []; // addon components, like checkbox, label, and folding arrow

        if (this.props.isFirstColumn) { // process addon widgets
            const additionalItemSize = +this.props.size < 30 ? '12' : '18';
            let allAddons: ItemsForRender[] = [];

            if (row.dnd) {
                allAddons.push({
                    component: <>{ row.dnd && row.dnd.srcData && <DragHandle cx={ css.dragHandle } /> }</>,
                    widthCost: 6,
                });
            }

            if (row.checkbox && row.checkbox.isVisible) {
                allAddons.push({
                    component: <Checkbox
                        key='cb'
                        cx={ css.checkbox }
                        size={ additionalItemSize }
                        value={ row.isChecked }
                        indeterminate={ !row.isChecked && row.isChildrenChecked }
                        onValueChange={ () => row.onCheck(row) }
                        isDisabled={ row.checkbox.isDisabled }
                        isInvalid={ row.checkbox.isInvalid }
                    />,
                    widthCost: 24,
                });
            }

            if (row.indent > 0) {
                allAddons.push({
                    component: <div key='fold' className={ css.indent } style={ { marginLeft: (row.indent - 1) * 24 } }>
                        { row.isFoldable && <IconContainer
                            key='icon'
                            icon={ foldingArrow }
                            cx={ [css.foldingArrow, css[`folding-arrow-${additionalItemSize}`], uuiMarkers.clickable] }
                            rotate={ row.isFolded ? '90ccw' : '0' }
                            onClick={ () => row.onFold(row) }
                        /> }
                    </div>,
                    widthCost: row.indent * 24,
                });
            }

            // Split all addons in two parts - which are placed in padding, and which are placed in the cell
            let addonsInPadding: ItemsForRender[] = [];
            let addonsInCell: ItemsForRender[] = [];

            allAddons.forEach(item => {
                if (item.widthCost < reusablePadding) {
                    addonsInPadding.push(item);
                    reusablePadding -= item.widthCost;
                } else {
                    addonsInCell.push(item);
                }
            });

            if (addonsInPadding.length > 0) {
                addonWidgets.push(<div key='bp' className={ css.beforePaddings } style={ { 'width': `12px` } }>
                    { addonsInPadding.map(item => item.component) }
                </div>);
            }

            if (addonsInCell.length > 0) {
                addonWidgets.push(<div key='ap' className={ css.afterPaddings }>{ addonsInCell.map(a => a.component) }</div>);
            }
        }

        // If we add any addons, we need to place them, as well as user-defined content in a flexbox.
        // To keep user's layout in clock context (not in flex), we wrap it in a div that spans over whole available space.
        if (addonWidgets.length > 0) {
            cellContent = <div key='w' className={ css.wrappedContent }>{ cellContent }</div>;
        }

        return (
            <FlexCell
                { ...this.props.column }
                cx={ cx(
                    css.cell,
                    addonWidgets.length > 0 && css.wrapper,
                    css['size-' + (this.props.size || '36')],
                    css[`padding-${ this.props.padding || '12' }`],
                    this.props.isFirstColumn && css[`padding-left-${ this.getCellPadding() }`],
                    this.props.isLastColumn && css['padding-right-24'],
                    this.props.column.cx,
                    css[`align-widgets-${ this.props.alignActions || 'top' }`],
                ) }>
                { addonWidgets }
                { cellContent }
            </FlexCell>
        );
    }
}