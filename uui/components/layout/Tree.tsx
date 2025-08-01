import * as React from 'react';
import {
    IHasCX,
    DataRowProps,
    IDataSourceView,
    cx,
    DataSourceState,
} from '@epam/uui-core';
import { VerticalTabButton } from '../buttons';
import { VirtualList } from './VirtualList';
import { useMemo } from 'react';
import { TextPlaceholder } from '../typography';

/**
 * Properties for a Tree component
 */
export interface TreeProps<TItem, TId> extends IHasCX {
    /**
     * View to get data for the tree. Use dataSource.useView(...) to get the view.
     */
    view: IDataSourceView<TItem, TId, any>;
    /**
     * Render callback for tree row.
     * If not provided, VerticalTabButton will be used by default.
     */
    renderRow?: (row: DataRowProps<TItem, TId>) => React.ReactNode;
    /**
     * Size for default VerticalTabButton renderer.
     * Default: '36'
     */
    size?: '30' | '36' | '48';
    /**
     * DataSourceState state
     */
    value: DataSourceState;
    /**
     * Callback to handle changes in DataSourceState.
     */
    onValueChange: React.Dispatch<React.SetStateAction<DataSourceState<Record<string, any>, any>>>;
    /**
     * Function to get the caption for each item.
     * @param item
     */
    getCaption: (item: TItem) => string;
    /**
     * Optional function to render additional elements in the row.
     * @param row
     */
    renderAddons?: (row: DataRowProps<TItem, TId>) => React.ReactNode;
}

function TreeRowRenderer<TItem, TId = string>(props: {
    row: DataRowProps<TItem, TId>;
    size: '30' | '36' | '48';
    getCaption: (item: TItem) => string;
    renderAddons?: (row: DataRowProps<TItem, TId>) => React.ReactNode;
}) {
    const { row, size } = props;
    const handleClick = React.useCallback(() => {
        const cb = row.onClick || row.onSelect;
        if (cb && !row.isDisabled) {
            cb(row);
        }
    }, [row]);
    const handleFold = React.useCallback(() => row.onFold && row.onFold(row), [row]);
    const renderAddons = React.useCallback(() => props.renderAddons && props.renderAddons(row), [props.renderAddons, row]);
    const isActive = row.isSelected;
    const getCaption = React.useCallback((value: TItem): string => {
        return props.getCaption(value);
    }, [props.getCaption]);

    return (
        <VerticalTabButton
            { ...row }
            isActive={ isActive }
            caption={ row.isLoading ? <TextPlaceholder /> : getCaption(row.value) }
            size={ size }
            onClick={ (row.onClick || row.onSelect) ? handleClick : undefined }
            link={ row.link }
            onFold={ row.onFold ? handleFold : undefined }
            weight={ (row.isChildrenSelected || row.isSelected || isActive) ? 'semibold' : 'regular' }
            renderAddons={ renderAddons }
        />
    );
}

const MemoizedTreeRowRenderer = React.memo(TreeRowRenderer) as typeof TreeRowRenderer;

export function Tree<TItem, TId = string>(props: TreeProps<TItem, TId>) {
    const {
        view,
        renderRow,
        size = '36',
        cx: propsCx,
        value,
        onValueChange,
    } = props;

    const rows = view.getVisibleRows();
    const rowsCount = view.getListProps().rowsCount ?? rows.length;

    const renderRowFunction = renderRow || (({ key, ...row }: DataRowProps<TItem, TId>) => (
        <MemoizedTreeRowRenderer
            key={ key }
            row={ row }
            size={ size }
            getCaption={ props.getCaption }
            renderAddons={ props.renderAddons }
        />
    ));

    const renderedRows = useMemo(
        () => rows.map((row) => renderRowFunction(row)),
        [rows, renderRowFunction, size],
    );

    return (
        <VirtualList
            value={ value }
            onValueChange={ onValueChange }
            rowsCount={ rowsCount }
            rows={ renderedRows }
            cx={ cx(propsCx) }
            role="tree"
        />
    );
}
