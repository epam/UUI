import * as React from 'react';
import cx from 'classnames';
import { IDisableable, IDropdownTogglerProps, IHasCX, uuiElement, uuiMarkers, uuiMod } from '@epam/uui-core';
import { IconContainer, FlexRow } from '@epam/uui-components';
import { systemIcons } from '../../icons/icons';
import { Text } from '../typography';
import { UUI_FILTERS_PANEL_ITEM_TOGGLER } from './constants';
import css from './FilterPanelItemToggler.module.scss';

const defaultSize = '36';

export interface FilterToolbarItemTogglerProps extends IDropdownTogglerProps, IDisableable, IHasCX {
    selection?: React.ReactNode[];
    postfix?: string | null | JSX.Element;
    title?: string;
    maxWidth?: number;
    size?: '24' | '30' | '36' | '42' | '48';
    predicateName: string | null;
}

export const FilterPanelItemToggler = /* @__PURE__ */React.forwardRef<HTMLDivElement, FilterToolbarItemTogglerProps>((props, ref) => {
    const togglerPickerOpened = (e: React.MouseEvent<HTMLDivElement>) => {
        if (props.isDisabled) return;
        e.preventDefault();
        props.onClick?.();
    };

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLElement>) => {
        if (props.isDisabled) return;

        if (e.key === 'Enter' && !props.isOpen) {
            e.preventDefault();
            props.toggleDropdownOpening(true);
        }

        if (e.key === 'Escape' && props.isOpen) {
            e.preventDefault();
            props.toggleDropdownOpening(false);
        }
    };

    const getTitle = props.predicateName ? `${props.title} ${props.predicateName}` : `${props.title}${props.selection ? ':' : ''}`;

    const getSelectionText = () => props.selection.map((i, index) => (
        <React.Fragment key={ `${i}${index}` }>
            <Text color="primary" size={ props.size } cx={ css.selection }>{ i }</Text>
            { (props.postfix || index !== props.selection.length - 1) && <span>,&nbsp;</span> }
        </React.Fragment>
    ));

    return (
        <FlexRow
            { ...props }
            rawProps={ {
                style: { maxWidth: `${props.maxWidth ? props.maxWidth + 'px' : 'auto'}` },
                role: 'button',
                tabIndex: props.isDisabled ? -1 : 0,
                onKeyDown: onKeyDownHandler,
            } }
            cx={ cx(
                UUI_FILTERS_PANEL_ITEM_TOGGLER,
                css.root,
                uuiElement.inputBox,
                uuiMarkers.clickable,
                props.isOpen && uuiMod.opened,
                `size-${props.size || defaultSize}`,
                props.cx,
            ) }
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
                                <Text color="primary" size={ props.size } cx={ css.postfix }>
                                    {props.postfix}
                                </Text>
                            )}
                        </div>
                    )
                }
            </FlexRow>
            {!props.isDisabled && <IconContainer icon={ systemIcons.foldingArrow } flipY={ props.isOpen } cx="uui-icon-dropdown" />}
        </FlexRow>
    );
});
