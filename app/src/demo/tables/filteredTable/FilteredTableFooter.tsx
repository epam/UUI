import React, { useState } from 'react';
import css from './FilteredTableFooter.module.scss';
import {
    FlexCell, LabeledInput, TextInput, Text, PickerInput, Button, Paginator, FlexRow,
} from '@epam/uui';
import { DataTableState, useArrayDataSource } from '@epam/uui-core';
import { ReactComponent as ArrowRightIcon_24 } from '@epam/assets/icons/common/navigation-chevron-right-18.svg';
import { FlexSpacer } from '@epam/uui-components';

interface IFilteredTableFooterProps {
    tableState: DataTableState;
    setTableState: (newState: DataTableState) => void;
    totalCount: number;
}

export function FilteredTableFooter(props: IFilteredTableFooterProps) {
    const [goToPage, setGoToPage] = useState('1');
    const totalPages = props.tableState.pageSize ? Math.ceil(props.totalCount / props.tableState.pageSize) : 0;
    const goToPageHandler = () => props.setTableState({ ...props.tableState, page: +goToPage, scrollTo: { index: 0 } });
    const paginatorHandler = (newPage: number) => props.setTableState({ ...props.tableState, page: newPage, scrollTo: { index: 0 } });

    const itemsPerPageDataSource = useArrayDataSource(
        {
            items: [
                { id: 40, page: '40' }, { id: 80, page: '80' }, { id: 120, page: '120' }, { id: 160, page: '160' },
            ],
        },
        [],
    );

    const setGoToPageHandler = (newValue: string) => {
        if (typeof +newValue === 'number' && !isNaN(+newValue) && +newValue <= totalPages && +newValue > 0) {
            setGoToPage(() => newValue);
        }
    };

    const setItemsPerPage = (itemsPerPage: number) => {
        props.setTableState({ ...props.tableState, page: 1, pageSize: itemsPerPage });
        setGoToPage('1');
    };

    return (
        <FlexRow cx={ css.paginatorWrapper } padding="24" vPadding="12">
            <FlexCell width="auto">
                <Text>
                    {!!props.totalCount && props.totalCount}
                    {props?.totalCount === 0 ? 'No items' : props?.totalCount === 1 ? ' item' : ' items'}
                </Text>
            </FlexCell>
            <FlexSpacer />
            <div className={ css.itemsPerPage }>
                <LabeledInput size="24" label="Items per page" labelPosition="left">
                    <PickerInput
                        size="24"
                        placeholder="Select items per page"
                        dataSource={ itemsPerPageDataSource }
                        value={ props.tableState.pageSize }
                        onValueChange={ setItemsPerPage }
                        getName={ (item) => item.page }
                        selectionMode="single"
                        valueType="id"
                        sorting={ { field: 'page', direction: 'asc' } }
                        disableClear
                        searchPosition="none"
                    />
                </LabeledInput>
            </div>
            <div className={ css.goToPage }>
                <LabeledInput size="24" label="Go to page" labelPosition="left">
                    <TextInput size="24" value={ goToPage } onValueChange={ setGoToPageHandler } />
                </LabeledInput>
            </div>
            <Button cx={ css.goToPageButton } size="24" icon={ ArrowRightIcon_24 } onClick={ goToPageHandler } fill="outline" color="secondary" />
            <Paginator value={ props.tableState.page } onValueChange={ paginatorHandler } totalPages={ totalPages } size="24" />
        </FlexRow>
    );
}
