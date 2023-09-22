import React, { useCallback, useMemo } from 'react';
import css from './ColumnHeaderDropdown.module.scss';
import { Modifier } from 'react-popper';
import {
    IDropdownToggler, DropdownBodyProps, isMobile, mobilePopperModifier,
} from '@epam/uui-core';
import { Dropdown } from '@epam/uui-components';
import { Panel } from '../../layout';
import { MobileDropdownWrapper } from '../../pickers';
import { SortingPanel, SortingPanelProps } from './SortingPanel';

type ColumnHeaderDropdownProps = SortingPanelProps & {
    isOpen: boolean;
    isSortable: boolean;
    renderTarget: (props: IDropdownToggler) => React.ReactNode;
    renderFilter?: (dropdownProps: DropdownBodyProps) => React.ReactNode;
    onOpenChange(nV: boolean): void;
    title: string;
};

const ColumnHeaderDropdownImpl: React.FC<ColumnHeaderDropdownProps> = (props) => {
    const popperModifiers: Modifier<any>[] = useMemo(
        () => [
            {
                name: 'offset',
                options: { offset: [0, 1] },
            }, mobilePopperModifier,
        ],
        [],
    );

    const style = useMemo(
        () => ({
            width: isMobile() ? document.documentElement.clientWidth : undefined,
        }),
        [],
    );

    const closeDropdown = useCallback(() => props.onOpenChange(false), [props.onOpenChange]);

    return (
        <Dropdown
            renderTarget={ props.renderTarget }
            renderBody={ (dropdownProps) => (
                <Panel style={ style } shadow cx={ css.panel }>
                    <MobileDropdownWrapper title={ props.title } onClose={ closeDropdown }>
                        {props.isSortable && <SortingPanel sortDirection={ props.sortDirection } onSort={ props.onSort } />}
                        {props.renderFilter(dropdownProps)}
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
