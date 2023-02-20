import * as React from 'react';
import css from './FilterPaneltemToggler.scss';
import cx from 'classnames';
import { IDropdownToggler, IHasCX, uuiElement, uuiMarkers, uuiMod } from '@epam/uui-core';
import { systemIcons } from '../../icons/icons';
import { IconContainer, FlexRow } from '@epam/uui-components';
import { Text } from '../typography';

const defaultSize = '36';

export interface FilterToolbarItemTogglerProps extends IDropdownToggler {
    selection: string | null | JSX.Element;
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

    const getTitle = props.predicateName ? `${props.title} ${props.predicateName}` : `${props.title}:`;

    return (
        <FlexRow
            {...props}
            rawProps={{ style: { maxWidth: `${props.maxWidth ? props.maxWidth + 'px' : 'auto'}` } }}
            cx={cx(
                css.root,
                uuiElement.inputBox,
                uuiMarkers.clickable,
                props.isOpen && uuiMod.opened,
                ['size-' + (props.size || defaultSize)],
                props.cx
            )}
            onClick={togglerPickerOpened}
            ref={ref}
        >
            <FlexRow cx={css.titleWrapper}>
                <Text color="gray60" cx={css.title}>
                    {getTitle}
                </Text>
                <div className={css.textWrapper}>
                    <Text color="gray90" cx={css.selection}>
                        {props.selection}
                    </Text>
                    {props.postfix && (
                        <Text color="gray90" cx={css.postfix}>
                            {props.postfix}
                        </Text>
                    )}
                </div>
            </FlexRow>
            {!props.isDisabled && (
                <IconContainer icon={systemIcons[props.size || defaultSize].foldingArrow} flipY={props.isOpen} cx="uui-icon-dropdown" />
            )}
        </FlexRow>
    );
});
