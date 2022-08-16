import React from "react";
import css from "./FilteredTable.scss";
import { FlexRow, LabeledInput, PageButton, Paginator, PickerInput, TextInput } from "@epam/promo";
import { ReactComponent as ArrowRightIcon_24 } from "@epam/assets/icons/common/navigation-chevron-right-18.svg";
import { ArrayDataSource, ITableState } from "@epam/uui-core";

interface IFilteredTableFooterProps {
    itemsPerPageDataSource: ArrayDataSource;
    tableStateApi: ITableState;
    setItemsPerPage: (itemsPerPage: number) => void;
    goToPage: string;
    setGoToPageHandler: (newValue: string) => void;
    goToPageHandler: () => void;
    paginatorHandler: (newPage: number) => void;
    totalPages: () => number;
}

export const FilteredTableFooter = (props: IFilteredTableFooterProps) => {
    return (
        <FlexRow cx={ css.paginatorWrapper } padding="24" vPadding="12" background="gray5">
            <div className={ css.itemsPerPage }>
                <LabeledInput size="24" label="Items per page" labelPosition="left">
                    <PickerInput
                        size="24"
                        placeholder="Select items per page"
                        dataSource={ props.itemsPerPageDataSource }
                        value={ props.tableStateApi.tableState.pageSize }
                        onValueChange={ props.setItemsPerPage }
                        getName={ item => item.page }
                        selectionMode="single"
                        valueType={ 'id' }
                        sorting={ { field: 'page', direction: 'asc' } }
                        disableClear
                        searchPosition="none"
                    />
                </LabeledInput>
            </div>
            <div>
                <LabeledInput size="24" label="Go to page" labelPosition="left">
                    <TextInput
                        cx={ css.goToPage }
                        size="24"
                        value={ props.goToPage }
                        onValueChange={ props.setGoToPageHandler }
                    />
                </LabeledInput>
            </div>
            <PageButton
                cx={ css.goToPageButton }
                size="24"
                icon={ ArrowRightIcon_24 }
                onClick={ props.goToPageHandler }
                fill="white"
                color="gray50"
            />
            <Paginator
                value={ props.tableStateApi.tableState.page }
                onValueChange={ props.paginatorHandler }
                totalPages={ props.totalPages() }
                size="24"
            />
        </FlexRow>
    );
};