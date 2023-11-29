import * as React from 'react';
import { DataPickerCellProps } from '@epam/uui-core';
import { FlexSpacer, IconContainer } from '@epam/uui-components';
import { PickerCellMods } from './types';
import { TextPlaceholder, Text } from '../typography';
import { DataRowAddons } from '../addons';
import { ReactComponent as TickIcon_24 } from '@epam/assets/icons/common/notification-done-24.svg';
import { ReactComponent as TickIcon_18 } from '@epam/assets/icons/common/notification-done-18.svg';
import { ReactComponent as TickIcon_12 } from '@epam/assets/icons/common/notification-done-12.svg';

import css from './DataPickerCell.module.scss';

import { FlexCell } from '../layout';

const getIcon = (size: string) => {
    switch (size) {
        case '24':
            return TickIcon_12;
        case '30':
            return TickIcon_18;
        case '36':
            return TickIcon_18;
        case '42':
            return TickIcon_24;
        default:
            return TickIcon_18;
    }
};

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
            <div key={ props.rowProps.key } className={ css.renderItem }>
                {props.renderItem(props.rowProps.value, props.rowProps)}
                <FlexSpacer />
                {(props.rowProps.isChildrenSelected || props.rowProps.isSelected) && (
                    <div className={ css.iconWrapper }>
                        <IconContainer 
                            icon={ getIcon(props.size) } 
                            cx={ props.rowProps.isChildrenSelected ? css.iconDefault : css.iconPrimary }
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
                css.cell,
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
