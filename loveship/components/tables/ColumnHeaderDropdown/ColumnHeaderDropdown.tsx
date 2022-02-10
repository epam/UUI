import React, { ReactNode, useCallback, useMemo } from "react";
import css from "./ColumnHeaderDropdown.scss";
import { Modifier } from "react-popper";
import { IDropdownToggler, isMobile, mobilePopperModifier } from "@epam/uui-core";
import { Dropdown } from "@epam/uui-components";
import { Panel } from "../../layout";
import { MobileDropdownWrapper } from "../../pickers";
import { SortingPanel, SortingPanelProps } from "./SortingPanel";

type ColumnHeaderDropdownProps = SortingPanelProps & {
    isOpen: boolean;
    isSortable: boolean;
    renderTarget: (props: React.PropsWithRef<IDropdownToggler>) => ReactNode;
    renderFilter?: () => ReactNode;
    onOpenChange(nV: boolean): void;
    title: string;
};

export const ColumnHeaderDropdown: React.FC<ColumnHeaderDropdownProps> = props => {
    const popperModifiers: Modifier<any>[] = useMemo(() => [
        {
            name: 'offset',
            options: { offset: [0, 1] },
        },
        mobilePopperModifier,
    ], []);

    const style = useMemo(() => ({
        width: isMobile() ? document.documentElement.clientWidth : 350,
    }), []);

    const closeDropdown = useCallback(() => props.onOpenChange(false), [props.onOpenChange]);

    return (
        <Dropdown
            renderTarget={ props.renderTarget }
            renderBody={ dropdownProps => (
                <Panel background="white" style={ style } shadow cx={ css.panel }>
                    <MobileDropdownWrapper title={ props.title } close={ closeDropdown }>
                        { props.isSortable && (
                            <SortingPanel
                                onSort={ props.onSort }
                                sortDirection={ props.sortDirection }
                            />
                        ) }
                        { props.renderFilter() }
                    </MobileDropdownWrapper>
                </Panel>
            ) }
            modifiers={ popperModifiers }
            value={ props.isOpen }
            onValueChange={ props.onOpenChange }
        />
    );
};

