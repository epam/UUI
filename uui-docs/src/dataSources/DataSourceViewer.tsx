import React, { useCallback } from 'react';
import { DataPickerRow, VirtualList, Text, Panel, LinkButton } from '@epam/loveship';
import { FlexRow, Switch } from '@epam/uui';
import { DataRowProps, DataSourceState, IDataSource, IEditable } from '@epam/uui-core';
import css from './DataSourceViewer.module.scss';

interface Props<TItem, TId> extends IEditable<DataSourceState> {
    exampleTitle?: string;
    selectAll?: boolean;
    showSelectedOnly?: boolean;
    getName?: (item: TItem) => string;
    dataSource: IDataSource<TItem, TId, any>;
    onValueChange: React.Dispatch<React.SetStateAction<DataSourceState<any, TId>>>;
    onShowSelectedOnlyChange?: () => void;
}

export function DataSourceViewer<TItem, TId>(props: Props<TItem, TId>) {
    const { value, onValueChange, dataSource, exampleTitle, selectAll: showSelectAll, showSelectedOnly, onShowSelectedOnlyChange } = props;
    const view = dataSource.useView(value, onValueChange);

    const renderRow = (rowProps: DataRowProps<TItem, TId>) => {
        return (
            <DataPickerRow
                { ...rowProps }
                key={ rowProps.rowKey }
                padding="12"
                cx={ css.pickerRow }
                getName={ (item) => props.getName?.(item) ?? (item as { name: string }).name }
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
        <Panel cx={ css.panel }>
            <Text fontSize="14" cx={ css.text }>{exampleTitle}</Text>
            <FlexRow cx={ css.row }>
                <VirtualList
                    value={ value }
                    onValueChange={ onValueChange }
                    rows={ renderedRows }
                    { ...listProps }
                    cx={ css.list }
                />
            </FlexRow>
            <FlexRow cx={ css.row }>
                {showSelectAll && view.selectAll && (
                    <LinkButton
                        size="24"
                        caption={ hasSelection ? 'Clear all' : 'Select all' }
                        onClick={ hasSelection ? clearAll : selectAll }
                    />
                )}
                {onShowSelectedOnlyChange && (
                    <Switch label="Show selected rows only" value={ showSelectedOnly } onValueChange={ onShowSelectedOnlyChange } />
                )}
            </FlexRow>
            { value.checked?.length > 0 && (
                <FlexRow cx={ css.row }>
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
