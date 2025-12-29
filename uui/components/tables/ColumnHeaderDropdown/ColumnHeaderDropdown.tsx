import React, { useCallback, useMemo } from 'react';
import {
    IDropdownToggler,
    DropdownBodyProps,
    mobilePositioning,
} from '@epam/uui-core';
import { Middleware, offset } from '@floating-ui/react';
import { Dropdown } from '@epam/uui-components';
import { PickerBodyMobileView } from '../../pickers';
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
    const middleware: Middleware[] = useMemo(
        () => [offset(1), mobilePositioning],
        [],
    );

    const closeDropdown = useCallback(() => props.onOpenChange(false), [props.onOpenChange]);

    return (
        <Dropdown
            renderTarget={ props.renderTarget }
            renderBody={ (dropdownProps) => (
                <PickerBodyMobileView
                    width={ 280 }
                    maxWidth="auto"
                    title={ props.title }
                    onClose={ closeDropdown }
                    rawProps={ { 'aria-modal': true } }
                >
                    {props.isSortable && <SortingPanel sortDirection={ props.sortDirection } onSort={ props.onSort } />}
                    {props.renderFilter(dropdownProps)}
                </PickerBodyMobileView>
            ) }
            middleware={ middleware }
            value={ props.isOpen }
            onValueChange={ props.onOpenChange }
        />
    );
};

export const ColumnHeaderDropdown = React.memo(ColumnHeaderDropdownImpl);
