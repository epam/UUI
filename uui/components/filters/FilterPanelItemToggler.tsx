import * as React from 'react';
import cx from 'classnames';
import type { IDisableable, IDropdownTogglerProps, IHasCX } from '@epam/uui-core';
import { isEventTargetInsideClickable, uuiElement, uuiMarkers, uuiMod } from '@epam/uui-core';
import { IconContainer } from '@epam/uui-components';
import { Text } from '../typography';
import { UUI_FILTERS_PANEL_ITEM_TOGGLER } from './constants';
import { settings } from '../../settings';

import css from './FilterPanelItemToggler.module.scss';

import type { JSX } from 'react';

export interface FilterToolbarItemTogglerProps extends IDropdownTogglerProps, IDisableable, IHasCX {
    selection?: React.ReactNode[];
    postfix?: string | null | JSX.Element;
    title?: string;
    maxWidth?: number;
    size?: '24' | '30' | '36' | '42' | '48';
    predicateName: string | null;
}

export const FilterPanelItemToggler = React.forwardRef<HTMLDivElement, FilterToolbarItemTogglerProps>((props, ref) => {
    const togglerPickerOpened = (e: React.MouseEvent<HTMLDivElement>) => {
        if (props.isDisabled) return;
        e.preventDefault();
        !isEventTargetInsideClickable(e) && props.onClick?.();
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
        <div
            style={ { maxWidth: `${props.maxWidth ? props.maxWidth + 'px' : 'auto'}` } }
            role="button"
            tabIndex= { props.isDisabled ? -1 : 0 }
            onKeyDown={ onKeyDownHandler }
            className={ cx(
                UUI_FILTERS_PANEL_ITEM_TOGGLER,
                css.root,
                uuiElement.inputBox,
                uuiMarkers.clickable,
                props.isOpen && uuiMod.opened,
                `uui-size-${props.size || settings.pickerInput.sizes.toggler.default}`,
                props.cx,
            ) }
            onClick={ togglerPickerOpened }
            ref={ ref }
        >
            <div className={ css.titleWrapper }>
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
            </div>
            {!props.isDisabled && <IconContainer icon={ settings.filtersPanel.icons.itemDropdownIcon } flipY={ props.isOpen } cx="uui-icon-dropdown" />}
        </div>
    );
});
