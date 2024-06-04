import React, { useCallback, useMemo } from 'react';
import { Modifier } from 'react-popper';
import { IDropdownToggler, DropdownBodyProps, mobilePopperModifier } from '@epam/uui-core';
import { Dropdown } from '@epam/uui-components';
import { MobileDropdownWrapper } from '../../pickers';
import { SortingPanel, SortingPanelProps } from './SortingPanel';
import { DropdownMenuBody } from '../../overlays';

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

    const closeDropdown = useCallback(() => props.onOpenChange(false), [props.onOpenChange]);

    return (
        <Dropdown
            renderTarget={ props.renderTarget }
            renderBody={ (dropdownProps) => (
                <DropdownMenuBody { ...dropdownProps } rawProps={ { style: { padding: 0 } } }>
                    <MobileDropdownWrapper width={ 280 } maxWidth="auto" title={ props.title } onClose={ closeDropdown }>
                        {props.isSortable && <SortingPanel sortDirection={ props.sortDirection } onSort={ props.onSort } />}
                        {props.renderFilter(dropdownProps)}
                    </MobileDropdownWrapper>
                </DropdownMenuBody>
            ) }
            modifiers={ popperModifiers }
            value={ props.isOpen }
            onValueChange={ props.onOpenChange }
        />
    );
};

export const ColumnHeaderDropdown = React.memo(ColumnHeaderDropdownImpl);
