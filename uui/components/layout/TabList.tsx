import {
    type IControlled,
    type IHasDirection,
} from '@epam/uui-core';
import React, {
    type ComponentProps,
    type KeyboardEvent,
    type KeyboardEventHandler,
    type ReactNode,
} from 'react';

import {
    TabButton,
    VerticalTabButton,
} from '../buttons';
import {
    FlexRow,
} from './FlexItems';
import css from './TabList.module.scss';

type FlexRowProps = ComponentProps<typeof FlexRow>;

type TabButtonPropsBase =
    | ComponentProps<typeof TabButton>
    | ComponentProps<typeof VerticalTabButton>;

export type TabId = string;

export type TabButtonProps = TabButtonPropsBase & {
    id: TabId;
};

interface TabListProps extends
    IControlled<TabId>,
    IHasDirection,
    FlexRowProps {
    items: Array<TabButtonProps>;
}

export function TabList({
    items,
    value,
    onValueChange,
    direction = 'horizontal',
    borderBottom = direction === 'horizontal',
    cx,
    rawProps,
    ...otherProps
}: TabListProps): ReactNode {
    if (items.length === 0) {
        return null;
    }

    const tabLastIndex = items.length - 1;

    const stopKeyboardEvent: KeyboardEventHandler = (event): void => {
        event.stopPropagation();
        event.preventDefault();
    };

    const getTabCurrentIndex = (tabIdCurrent: TabId): number => {
        return items.findIndex((tabProps) => {
            return tabProps.id === tabIdCurrent;
        });
    };

    const moveToTabWithIndex = (tabIndex: number): void => {
        /*
            `id`-s provided in `items` are assigned to the tabs.
            Unless users manually broke this connection,
            the index calculation will be correct,
            and the tab element will be present in the DOM.
        */
        const tab = items.at(tabIndex)!;
        const tabElement = document.getElementById(tab.id)!;

        tabElement.focus();
    };

    const moveToPreviousTab = (tabIdCurrent: TabId): void => {
        const tabCurrentIndex = getTabCurrentIndex(tabIdCurrent);

        const tabIndexNext = tabCurrentIndex === 0
            ? tabLastIndex
            : tabCurrentIndex - 1;

        moveToTabWithIndex(tabIndexNext);
    };

    const moveToNextTab = (tabIdCurrent: TabId): void => {
        const tabCurrentIndex = getTabCurrentIndex(tabIdCurrent);

        const tabIndexNext = tabCurrentIndex === tabLastIndex
            ? 0
            : tabCurrentIndex + 1;

        moveToTabWithIndex(tabIndexNext);
    };

    const onKeyDown: KeyboardEventHandler = (event) => {
        type TargetElement =
            | HTMLButtonElement
            | HTMLAnchorElement
            | HTMLSpanElement;
        const focusedTabIdCurrent = (event.target as TargetElement).id;

        // https://www.w3.org/WAI/ARIA/apg/patterns/tabs/#keyboardinteraction
        switch (event.key) {
            case 'ArrowUp': {
                if (direction === 'vertical') {
                    stopKeyboardEvent(event);

                    moveToPreviousTab(focusedTabIdCurrent);
                }

                break;
            }

            case 'ArrowDown': {
                if (direction === 'vertical') {
                    stopKeyboardEvent(event);

                    moveToNextTab(focusedTabIdCurrent);
                }

                break;
            }

            case 'ArrowLeft': {
                stopKeyboardEvent(event);

                moveToPreviousTab(focusedTabIdCurrent);

                break;
            }

            case 'ArrowRight': {
                stopKeyboardEvent(event);

                moveToNextTab(focusedTabIdCurrent);

                break;
            }

            case 'Home': {
                stopKeyboardEvent(event);

                moveToTabWithIndex(0);

                break;
            }

            case 'End': {
                stopKeyboardEvent(event);

                moveToTabWithIndex(tabLastIndex);

                break;
            }

            default: {
                break;
            }
        }
    };

    return (
        <FlexRow
            borderBottom={ borderBottom }
            cx={ [
                {
                    [css.vertical]: direction === 'vertical',
                },
                cx,
            ] }
            rawProps={ {
                role: 'tablist',
                'aria-orientation': direction,
                ...rawProps,
            } }
            { ...otherProps }
        >
            {
                items.map((tabProps) => {
                    const {
                        id,
                    } = tabProps;

                    const handleTabClick: TabButtonProps['onClick'] = () => {
                        onValueChange(id);
                    };

                    const isLinkActive = id === value;
                    const handleOnClick = (
                        tabProps.link === undefined
                        && tabProps.href === undefined
                    )
                        ? handleTabClick
                        : tabProps.onClick;
                    const tabIndex = isLinkActive
                        ? undefined
                        : -1;
                    const Component = direction === 'vertical'
                        ? VerticalTabButton
                        : TabButton;

                    return (
                        <Component
                            key={ id }
                            isLinkActive={ isLinkActive }
                            tabIndex={ tabIndex }
                            { ...tabProps }
                            onClick={ handleOnClick }
                            rawProps={ {
                                id,
                                role: 'tab',
                                'aria-selected': isLinkActive,
                                ...tabProps.rawProps,
                                onKeyDown: (
                                    event: KeyboardEvent<HTMLAnchorElement>
                                    & KeyboardEvent<HTMLButtonElement>
                                    & KeyboardEvent<HTMLSpanElement>,
                                ) => {
                                    onKeyDown(event);

                                    tabProps.rawProps?.onKeyDown?.(event);
                                },
                            } }
                        />
                    );
                })
            }
        </FlexRow>
    );
}
