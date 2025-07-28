import {
    type IControlled,
} from '@epam/uui-core';
import React, {
    forwardRef,
    type KeyboardEvent,
    type KeyboardEventHandler,
    ForwardedRef,
} from 'react';

import {
    TabButton,
    TabButtonProps,
} from '../buttons/TabButton';
import {
    FlexRow,
    FlexRowProps,
} from './FlexItems';

type TabId = string;

type TabElement =
    | HTMLButtonElement
    | HTMLAnchorElement
    | HTMLSpanElement;

export type TabListItemProps = TabButtonProps & {
    /** Ref to a tab button. */
    ref?: ForwardedRef<TabElement>;
    /** ID of the tab button. There should be only one element with such ID on a page. */
    id: TabId;
};

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

                        type OnKeyDownEvent =
                            & KeyboardEvent<HTMLAnchorElement>
                            & KeyboardEvent<HTMLButtonElement>
                            & KeyboardEvent<HTMLSpanElement>;

                        const handleOnKeyDown = (event: OnKeyDownEvent): void => {
                            onKeyDown(event);

                            tabProps.rawProps?.onKeyDown?.(event);
                        };

                        const isLinkActive = id === value;

                        const tabIndex = isLinkActive
                            ? undefined
                            : -1;

                        return (
                            <TabButton
                                key={ id }
                                isLinkActive={ isLinkActive }
                                tabIndex={ tabIndex }
                                { ...tabProps }
                                onClick={ handleOnClick }
                                rawProps={ {
                                    id,
                                    'aria-selected': isLinkActive,
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
