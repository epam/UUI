import * as React from 'react';
import cx from 'classnames';
import { IDropdownToggler, IHasCX, uuiElement, uuiMarkers, uuiMod } from '@epam/uui-core';
import { systemIcons } from '../../icons/icons';
import { IconContainer, FlexRow } from '@epam/uui-components';
import { Text } from '../typography';
import css from './FilterPanelItemToggler.module.scss';

const defaultSize = '36';

export interface FilterToolbarItemTogglerProps extends IDropdownToggler {
    selection?: React.ReactNode[];
    postfix?: string | null | JSX.Element;
    title?: string;
    maxWidth?: string;
    size?: '24' | '30' | '36' | '42' | '48';
    cx?: IHasCX;
    predicateName: string | null;
}

export const FilterPanelItemToggler = React.forwardRef<HTMLDivElement, FilterToolbarItemTogglerProps>((props, ref) => {
    const togglerPickerOpened = (e: React.MouseEvent<HTMLDivElement>) => {
        if (props.isDisabled) return;
        e.preventDefault();
        props.onClick?.();
    };

    const getTitle = props.predicateName ? `${props.title} ${props.predicateName}` : `${props.title}${props.selection ? ':' : ''}`;

    const getSelectionText = () => props.selection.map((i, index) => (
        <>
            <Text key={ index } color="brand" size={ props.size } cx={ css.selection }>{i}</Text>
            { (props.postfix || index !== props.selection.length - 1) && <span>,&nbsp;</span> }
        </>
    ));

    return (
        <FlexRow
            { ...props }
            rawProps={ {
                style: { maxWidth: `${props.maxWidth ? props.maxWidth + 'px' : 'auto'}` },
                role: 'button',
            } }
            cx={ cx(css.root, uuiElement.inputBox, uuiMarkers.clickable, props.isOpen && uuiMod.opened, ['size-' + (props.size || defaultSize)], props.cx) }
            onClick={ togglerPickerOpened }
            ref={ ref }
        >
            <FlexRow cx={ css.titleWrapper }>
                <Text size={ props.size } cx={ css.title }>{getTitle}</Text>
                {
                    props.selection && (
                        <div className={ css.textWrapper }>
                            { getSelectionText() }
                            {props.postfix && (
                                <Text color="brand" size={ props.size } cx={ css.postfix }>
                                    {props.postfix}
                                </Text>
                            )}
                        </div>
                    )
                }
            </FlexRow>
            {!props.isDisabled && <IconContainer icon={ systemIcons[props.size || defaultSize].foldingArrow } flipY={ props.isOpen } cx="uui-icon-dropdown" />}
        </FlexRow>
    );
});
