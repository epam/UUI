import React, { useCallback } from 'react';
import { DataPickerRow, VirtualList, Text, Panel, LinkButton } from '@epam/promo';
import { FlexRow, PickerItem } from '@epam/uui';
import { DataRowProps, DataSourceState, IDataSource, IEditable } from '@epam/uui-core';

interface Props<TItem, TId> extends IEditable<DataSourceState> {
    exampleTitle?: string;
    selectAll?: boolean;
    getName?: (item: TItem) => string;
    dataSource: IDataSource<TItem, TId, any>;
}

export function DataSourceViewer<TItem, TId>(props: Props<TItem, TId>) {
    const { value, onValueChange, dataSource, exampleTitle, selectAll: showSelectAll } = props;
    const view = dataSource.useView(value, onValueChange);

    const renderItem = (item: TItem, rowProps: DataRowProps<TItem, TId>) => {
        return (
            <PickerItem
                title={ props.getName?.(item) ?? (item as { name: string }).name }
                size="36"
                { ...rowProps }
            />
        );
    };

    const renderRow = (rowProps: DataRowProps<TItem, TId>) => {
        return (
            <DataPickerRow
                { ...rowProps }
                key={ rowProps.rowKey }
                padding="12"
                renderItem={ renderItem }
            />
        );
    };
    const clearAll = useCallback(
        () => {
            onValueChange({ ...value, checked: [] });
        },
        [onValueChange, value],
    );
    
    const selectAll = useCallback(
        () => {
            view.selectAll.onValueChange(true);
        },
        [view.selectAll],
    );

    const renderedRows = view.getVisibleRows().map(renderRow);
    const hasSelection = view.getSelectedRowsCount() > 0;
    const listProps = view.getListProps();

    return (
        <Panel>
            <Text fontSize="14">{exampleTitle}</Text>
            <FlexRow>
                <VirtualList
                    value={ value }
                    onValueChange={ onValueChange }
                    rows={ renderedRows }
                    { ...listProps }
                />
            </FlexRow>
            <FlexRow>
                {showSelectAll && view.selectAll && (
                    <LinkButton
                        size="24"
                        caption={ hasSelection ? 'Clear all' : 'Select all' }
                        onClick={ hasSelection ? clearAll : selectAll }
                    />
                )}
            </FlexRow>
            { value.checked?.length > 0 && (
                <FlexRow>
                    <Text>
                        Selected:
                        {' '}
                        {value.checked?.map((id) => JSON.stringify(id)).join(', ')}
                    </Text>
                </FlexRow>
            ) }
        </Panel>
    );
}
