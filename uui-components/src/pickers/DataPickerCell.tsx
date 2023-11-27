import React from 'react';
import {
    DataTableCellProps, uuiMod,
} from '@epam/uui-core';
import css from './DataPickerCell.module.scss';
import { FlexCell } from '../layout';

export function DataPickerCell<TItem, TId, TCellValue>(props: DataTableCellProps<TItem, TId, TCellValue>) {
    const ref = React.useRef<HTMLDivElement>();

    let content: React.ReactNode;

    if (props.rowProps.isLoading) {
        content = props.renderPlaceholder(props);
    } else if (props.rowProps.isUnknown) {
        content = props.renderUnknown(props);
    } else {
        content = props.column.render(props.rowProps.value, props.rowProps);
    }

    let justifyContent = props.column.justifyContent;
    if (!justifyContent && props.column.textAlign) {
        justifyContent = props.column.textAlign;
    }

    const { textAlign, alignSelf } = props.column;
    const styles = {
        textAlign,
        alignSelf,
        justifyContent,
    };

    const getWrappedContent = () => (
        <div style={ styles } className={ css.contentWrapper }>
            {content}
        </div>
    );

    return (
        <FlexCell
            ref={ ref }
            grow={ props.column.grow }
            width={ props.column.width }
            minWidth={ props.column.width }
            textAlign={ props.isFirstColumn ? undefined : props.column.textAlign }
            alignSelf={ props.isFirstColumn ? undefined : props.column.alignSelf }
            rawProps={ { role: 'cell' } }
            cx={ [
                css.cell, props.column.cx, props.cx, props.isInvalid && uuiMod.invalid,
            ] }
            style={ !props.isFirstColumn && { justifyContent: justifyContent } }
        >
            {props.addons}
            {props.isFirstColumn ? getWrappedContent() : content}
        </FlexCell>
    );
}
