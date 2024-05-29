import * as React from 'react';
import { DataPickerCellProps, uuiMod, cx } from '@epam/uui-core';
import { FlexSpacer, IconContainer } from '@epam/uui-components';
import { PickerCellMods } from './types';
import { TextPlaceholder, Text } from '../typography';
import { DataRowAddons } from '../widgets';
import { ReactComponent as BoldTickIcon } from '@epam/assets/icons/notification-done-fill.svg';
import { ReactComponent as TickIcon } from '@epam/assets/icons/notification-done-outline.svg';

import css from './DataPickerCell.module.scss';

import { FlexCell } from '../layout';

export function DataPickerCell<TItem, TId>(props: DataPickerCellProps<TItem, TId> & PickerCellMods) {
    const ref = React.useRef<HTMLDivElement>();

    let content: React.ReactNode;

    if (props.rowProps.isLoading) {
        content = (
            // remove `css.loadingCell` after` removing `margin: 0 3px 3px 0` from `TextPlaceholder` `loadingWord` class styles.
            <Text key="t" size={ props.size !== '60' ? props.size : '48' } cx={ css.loadingCell }>
                <TextPlaceholder />
            </Text>
        );
    } else if (props.rowProps.isUnknown) {
        content = (
            <Text key="t" size={ props.size !== '60' ? props.size : '48' }>
                Unknown
            </Text>
        );
    } else {
        content = (
            <div key={ `${props.rowProps.id}` } className={ css.renderItem }>
                {props.renderItem(props.rowProps.value, props.rowProps)}
                <FlexSpacer />
                {(props.rowProps.isChildrenSelected || props.rowProps.isSelected) && (
                    <div className={ cx(css.iconWrapper, uuiMod.selected) }>
                        <IconContainer 
                            icon={ props.size === '24' ? BoldTickIcon : TickIcon }
                            cx={ cx(css.root, props.rowProps.isChildrenSelected ? css.iconDefault : 'uui-data_cell-checkmark') }
                            rawProps={ { 'aria-label': props.rowProps.isChildrenSelected 
                                ? 'Child is selected' 
                                : 'Selected' } }
                        />
                    </div>
                )}
            </div>
        );
    }

    const getWrappedContent = () => (
        <div className={ css.contentWrapper }>
            {content}
        </div>
    );

    return (
        <FlexCell
            ref={ ref }
            grow={ 1 }
            width={ 0 }
            minWidth={ 0 }
            rawProps={ { role: 'cell' } }
            cx={ [
                css.root,
                props.cx,
                'data-picker-cell',
                css['size-' + (props.size || '36')],
                css[`padding-${props.padding || '12'}`],
                css[`padding-left-${props.padding || '24'}`],
                css[`align-widgets-${props.alignActions || 'top'}`],
            ] }
        >
            <DataRowAddons { ...props } />
            {getWrappedContent()}
        </FlexCell>
    );
}
