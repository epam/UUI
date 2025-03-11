import React, { useCallback } from 'react';
import { DataPickerRow, VirtualList, Text, Panel, LinkButton } from '@epam/uui';
import { FlexRow } from '@epam/uui';
import { DataRowProps, DataSourceState, IDataSource, IEditable } from '@epam/uui-core';

interface Props<TItem, TId> extends IEditable<DataSourceState> {
    exampleTitle?: string;
    selectAll?: boolean;
    getName?: (item: TItem) => string;
    dataSource: IDataSource<TItem, TId, any>;
    onValueChange: React.Dispatch<React.SetStateAction<DataSourceState<any, TId>>>;
}

export function DataSourceViewer<TItem, TId>(props: Props<TItem, TId>) {
    const { value, onValueChange, dataSource, exampleTitle, selectAll: showSelectAll } = props;
    const view = dataSource.useView(value, onValueChange);

    const renderRow = (rowProps: DataRowProps<TItem, TId>) => {
        return (
            <DataPickerRow
                { ...rowProps }
                getName={ (item) => props.getName?.(item) ?? (item as { name: string }).name }
                key={ rowProps.rowKey }
                padding="12"
                size="36"
            />
        );
    };
    const clearAll = useCallback(
        () => {
            view.clearAllChecked();
        },
        [view],
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
