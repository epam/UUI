import * as React from 'react';
import cx from 'classnames';
import { IDropdownToggler, IHasCX, uuiElement, uuiMarkers, uuiMod } from '@epam/uui-core';
import { systemIcons } from '../../icons/icons';
import { IconContainer, FlexRow } from '@epam/uui-components';
import { Text } from '../typography';
import css from './FilterPanelItemToggler.module.scss';

const defaultSize = '36';

export interface FilterToolbarItemTogglerProps extends IDropdownToggler {
    selection: string[] | null | JSX.Element[];
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

    const isArrayOfStrings = (value: any): value is string[] => Array.isArray(value) && value.every((item) => typeof item === 'string');

    const getSelectionText = () => {
        if (props.selection && isArrayOfStrings(props.selection)) {
            return props.selection?.length === 0
                ? <Text color="brand" size={ props.size } cx={ css.selection }>{props.selection[0]}</Text>
                : props.selection.map((i, index) => {
                    const isLastSelection = index === props.selection.length - 1;
                    const commaWithSpace = <span className={ cx(!isLastSelection && css.comma) }>,</span>;

                    return (
                        <>
                            <Text color="brand" size={ props.size }>{i}</Text>
                            { (props.postfix || !isLastSelection) && commaWithSpace }
                        </>
                    );
                });
        } else {
            return (
                <Text color="brand" size={ props.size } cx={ css.selection }>
                    {props.selection}
                </Text>
            );
        }
    };

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
