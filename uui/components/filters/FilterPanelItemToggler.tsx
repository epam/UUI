import * as React from 'react';
import cx from 'classnames';
import type { IDisableable, IDropdownTogglerProps, IHasCX } from '@epam/uui-core';
import { isEventTargetInsideClickable, uuiElement, uuiMarkers, uuiMod } from '@epam/uui-core';
import { IconContainer } from '@epam/uui-components';
import type { FiltersPanelProps } from './FiltersPanel';
import {
    UUI_FILTERS_PANEL_ITEM_TOGGLER, UUI_FILTERS_PANEL_ITEM_TOGGLER_POSTFIX,
    UUI_FILTERS_PANEL_ITEM_TOGGLER_SELECTION, UUI_FILTERS_PANEL_ITEM_TOGGLER_TITLE,
} from './constants';
import { settings } from '../../settings';

import css from './FilterPanelItemToggler.module.scss';

export interface FilterToolbarItemTogglerProps extends IDropdownTogglerProps, IDisableable, IHasCX, Pick<FiltersPanelProps<any>, 'size'> {
    selection?: React.ReactNode[];
    postfix?: string | null | JSX.Element;
    title?: string;
    maxWidth?: number;
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
            <div className={ cx(css.selection, UUI_FILTERS_PANEL_ITEM_TOGGLER_SELECTION) }>{ i }</div>
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
                props.selection?.length > 0 && uuiMarkers.hasValue,
                `uui-size-${props.size || settings.pickerInput.sizes.toggler.default}`,
                props.cx,
            ) }
            onClick={ togglerPickerOpened }
            ref={ ref }
        >
            <div className={ css.titleWrapper }>
                <div className={ cx(css.title, UUI_FILTERS_PANEL_ITEM_TOGGLER_TITLE) }>{getTitle}</div>
                {
                    props.selection && (
                        <div className={ css.textWrapper }>
                            { getSelectionText() }
                            {props.postfix && (
                                <div className={ cx(css.postfix, UUI_FILTERS_PANEL_ITEM_TOGGLER_POSTFIX) }>
                                    {props.postfix}
                                </div>
                            )}
                        </div>
                    )
                }
            </div>
            {!props.isDisabled && <IconContainer icon={ settings.filtersPanel.icons.itemDropdownIcon } flipY={ props.isOpen } cx="uui-icon-dropdown" />}
        </div>
    );
});
