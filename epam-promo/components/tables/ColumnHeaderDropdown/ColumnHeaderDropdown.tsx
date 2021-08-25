import React, { Ref, useCallback, useMemo } from 'react';
import css from './ColumnHeaderDropdown.scss';
import { Modifier } from "react-popper";
import { IDropdownToggler, isMobile, mobilePopperModifier } from '@epam/uui';
import { Dropdown, DropdownBodyProps } from '@epam/uui-components';
import { Panel } from '../../layout';
import { MobileDropdownWrapper } from "../../pickers";
import { SortingPanel, SortingPanelProps } from "./SortingPanel";

type ColumnHeaderDropdownProps = SortingPanelProps & {
    isOpen: boolean;
    isSortable: boolean;
    renderTarget: (props: IDropdownToggler & { ref?: Ref<any> }) => React.ReactNode;
    renderFilter?: () => React.ReactNode;
    onOpenChange(nV: boolean): void;
    title: string;
};

const ColumnHeaderDropdownImpl: React.FC<ColumnHeaderDropdownProps> = props => {
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
            renderBody={ (dropdownProps: DropdownBodyProps) => (
                <Panel background="white" style={ style } shadow cx={ css.panel }>
                    <MobileDropdownWrapper title={ props.title } close={ closeDropdown }>
                        { props.isSortable && (
                            <SortingPanel
                                sortDirection={ props.sortDirection }
                                onSort={ props.onSort }
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

export const ColumnHeaderDropdown = React.memo(ColumnHeaderDropdownImpl);