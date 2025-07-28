import {
    type IControlled,
} from '@epam/uui-core';
import React, {
    type ComponentProps,
    forwardRef,
    type KeyboardEvent,
    type KeyboardEventHandler,
    RefObject,
    useRef,
} from 'react';

import {
    TabButton,
} from '../buttons/TabButton';
import {
    VerticalTabButton,
} from '../buttons/VerticalTabButton';
import {
    FlexRow,
} from './FlexItems';

type FlexRowProps = ComponentProps<typeof FlexRow>;

type TabButtonPropsBase =
    | ComponentProps<typeof TabButton>
    | ComponentProps<typeof VerticalTabButton>;

export type TabId = string;

export type TabListItemProps = TabButtonPropsBase & {
    id: TabId;
};

type TabElement =
    | HTMLButtonElement
    | HTMLAnchorElement
    | HTMLSpanElement;

type OnKeyDownEvent =
    & KeyboardEvent<HTMLAnchorElement>
    & KeyboardEvent<HTMLButtonElement>
    & KeyboardEvent<HTMLSpanElement>;

/*
    A separate component is only necessary to correctly define a ref,
    pass it to the tab component and call `click` on the tab element
    if it is a link to activate it when "Space" key is pressed.
    This manual activation is necessary because the role `tab` is expected to
    behave the same way regardless of implementation details (link or button),
    and links are not activated when pressing "Space" by default.
*/
const TabListItem = forwardRef<TabElement, TabListItemProps>(
    (
        tabProps,
        refExternal,
    ) => {
        const refLocal = useRef<TabElement | null>(null);
        const ref = refExternal !== null
            ? refExternal as RefObject<TabElement>
            : refLocal;

        const {
            id,
            isLinkActive,
        } = tabProps;

        const isLink = (
            tabProps.link !== undefined
            || tabProps.href !== undefined
        );

        const handleOnKeyDown = (event: OnKeyDownEvent): void => {
            if (
                isLink
                && event.code === 'Space'
            ) {
                tabProps.rawProps?.onKeyDown?.(event);

                ref.current?.click();
            } else {
                tabProps.rawProps?.onKeyDown?.(event);
            }
        };

        const tabIndex = isLinkActive
            ? undefined
            : -1;

        return (
            <TabButton
                key={ id }
                ref={ ref }
                tabIndex={ tabIndex }
                { ...tabProps }
                rawProps={ {
                    id,
                    role: 'tab',
                    'aria-selected': isLinkActive,
                    ...tabProps.rawProps,
                    onKeyDown: handleOnKeyDown,
                } }
            />
        );
    },
);

TabListItem.displayName = 'TabListItem';

export interface TabListProps extends
    IControlled<TabId>,
    FlexRowProps {
    /** `TabButton` or `VerticalTabButton` props with required `id`. */
    items: Array<TabListItemProps>;
}

export const TabList = forwardRef<HTMLDivElement, TabListProps>(
    (
        {
            items,
            value,
            onValueChange,
            borderBottom = true,
            rawProps,
            ...otherProps
        },
        ref,
    ) => {
        if (items.length === 0) {
            return null;
        }

        const tabLastIndex = items.length - 1;

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
            const focusedTabIdCurrent = (event.target as TabElement).id;

            // https://www.w3.org/WAI/ARIA/apg/patterns/tabs/#keyboardinteraction
            switch (event.code) {
                case 'ArrowLeft': {
                    moveToPreviousTab(focusedTabIdCurrent);

                    break;
                }

                case 'ArrowRight': {
                    moveToNextTab(focusedTabIdCurrent);

                    break;
                }

                case 'Home': {
                    moveToTabWithIndex(0);

                    break;
                }

                case 'End': {
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
                ref={ ref }
                borderBottom={ borderBottom }
                rawProps={ {
                    role: 'tablist',
                    'aria-orientation': 'horizontal',
                    ...rawProps,
                } }
                { ...otherProps }
            >
                {
                    items.map((tabProps) => {
                        const {
                            id,
                        } = tabProps;

                        const handleOnClick = (): void => {
                            onValueChange(id);

                            tabProps.onClick?.();
                        };

                        const handleOnKeyDown = (event: OnKeyDownEvent): void => {
                            onKeyDown(event);

                            tabProps.rawProps?.onKeyDown?.(event);
                        };

                        const isLinkActive = id === value;

                        return (
                            <TabListItem
                                key={ id }
                                isLinkActive={ isLinkActive }
                                { ...tabProps }
                                onClick={ handleOnClick }
                                rawProps={ {
                                    ...tabProps.rawProps,
                                    onKeyDown: handleOnKeyDown,
                                } }
                            />
                        );
                    })
                }
            </FlexRow>
        );
    },
);

TabList.displayName = 'TabList';
