import React, { useState } from 'react';
import {
    Checkbox,
    DataTable,
    DataTableRow,
    FlexRow,
    FlexSpacer,
    IconContainer,
    RichTextView,
    Text,
    Tooltip,
} from '@epam/uui';
import {
    DataColumnProps, DataTableRowProps,
    DataTableState, SortingOption,
    useTableState, useArrayDataSource,
} from '@epam/uui-core';
import { isApiRefPropGroup, TApiRefPropsItem } from './types';
import { TType } from './sharedTypes';
import { CodeExpandable } from './components/CodeExpandable';

import { ReactComponent as InfoIcon } from '@epam/assets/icons/common/table-info-fill-18.svg';
import css from './ApiRefTypePropsView.module.scss';

type TApiRefTypePropsView = {
    canGroup: boolean,
    columns: DataColumnProps<TApiRefPropsItem>[],
    docsGenType: TType,
    groupColumns: DataColumnProps<TApiRefPropsItem>[],
    isGrouped: boolean,
    items: TApiRefPropsItem[],
    onSetIsGrouped: (isGrouped: boolean) => void,
    showCode: boolean,
};

export function ApiRefTypePropsView(props: TApiRefTypePropsView) {
    const {
        columns,
        groupColumns,
        docsGenType,
        isGrouped,
        onSetIsGrouped,
        items,
        showCode,
        canGroup,
    } = props;
    const [tState, setTState] = useState<DataTableState>({});
    const tableStateApi = useTableState({
        value: tState,
        onValueChange: (v) => setTState(v),
        columns,
    });
    const { tableState, setTableState } = tableStateApi;
    const exportPropsDs = useArrayDataSource<TApiRefPropsItem, string, unknown>(
        {
            items: items,
            getId: (item) => {
                if (isApiRefPropGroup(item)) {
                    return item.from as string;
                }
                return String(item.uid);
            },
            sortBy(item: TApiRefPropsItem, sorting: SortingOption): any {
                if (sorting.field === 'from') {
                    if (item.from) {
                        const [module, typeName] = item.from.split(':');
                        // typeName goes first here, so that it's sorted by typeName and then by module.
                        return `${typeName}:${module}`;
                    }
                }
                return item[sorting.field as keyof TApiRefPropsItem];
            },
            getParentId(item: TApiRefPropsItem): string | undefined {
                if (isGrouped && !isApiRefPropGroup(item) && item.from) {
                    return item.from;
                }
            },
        },
        [items, isGrouped],
    );
    const isNoData = !docsGenType?.details?.props?.length;
    if (isNoData) {
        return null;
    }
    const view = exportPropsDs.getView(tableState, setTableState, {
        isFoldedByDefault: () => false,
    });
    const propsFromUnion = docsGenType?.details?.propsFromUnion;
    const hasToolbar = canGroup || propsFromUnion;
    const renderGroupBy = () => {
        if (canGroup) {
            return (
                <Checkbox value={ isGrouped } onValueChange={ onSetIsGrouped } label="Group By: From" />
            );
        }
    };
    const renderPropsInfo = () => {
        if (propsFromUnion) {
            const renderContent = () => {
                const html = `
                        <h5>This type uses unions</h5>
                        <p>
                            The table may contain same props with same or different types. 
                            Please see the source code to better understand exact typing.
                        </p>
                `;
                return (
                    <RichTextView htmlContent={ html } />
                );
            };
            return (
                <>
                    <Text>Union</Text>
                    <Tooltip renderContent={ renderContent } color="default">
                        <IconContainer
                            icon={ InfoIcon }
                            style={ { fill: '#008ACE', marginLeft: '5px' } }
                        />
                    </Tooltip>
                </>
            );
        }
    };
    const renderToolbar = () => {
        if (hasToolbar) {
            return (
                <FlexRow>
                    { renderGroupBy() }
                    <FlexSpacer />
                    { renderPropsInfo() }
                </FlexRow>
            );
        }
    };

    return (
        <div className={ css.root }>
            { renderToolbar() }
            <DataTable
                allowColumnsResizing={ false }
                value={ tableState }
                onValueChange={ setTableState }
                columns={ columns }
                getRows={ view.getVisibleRows }
                renderRow={ (props: DataTableRowProps<TApiRefPropsItem, string>) => {
                    if (props.value && isApiRefPropGroup(props.value)) {
                        return (
                            <DataTableRow
                                key={ props.id }
                                { ...props }
                                columns={ groupColumns }
                            />
                        );
                    }
                    return <DataTableRow key={ props.id } { ...props } indent={ 0 } columns={ columns } />;
                } }
                { ...view.getListProps() }
            />
            <CodeExpandable showCode={ showCode } docsGenType={ docsGenType } />
        </div>
    );
}
