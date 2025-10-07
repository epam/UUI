import React from 'react';
import cx from 'classnames';
import type { DataRowProps } from '@epam/uui-core';
import type { VirtualListRenderRowsParams } from '../../layout';
import { DataRowsGroups } from './DataRowsGroups';

import css from './DataRowsContainer.module.scss';

export interface DataRowsContainerProps<TItem, TId, List extends HTMLDivElement = any> extends VirtualListRenderRowsParams<List> {
    rows: DataRowProps<TItem, TId>[];
    renderRow: (row: DataRowProps<TItem, TId>) => React.ReactNode;
    headerRef?: React.MutableRefObject<HTMLDivElement>;
}

export function DataRowsContainer<TItem, TId, List extends HTMLDivElement = any>({
    estimatedHeight, listContainerRef, offsetY, rows, renderRow, headerRef,
}: DataRowsContainerProps<TItem, TId, List>) {
    return (
        <div className={ cx(css.listContainer, 'uui-dt-data_row_container') } style={ { minHeight: `${estimatedHeight}px` } }>
            <div ref={ listContainerRef } role="rowgroup" style={ { marginTop: offsetY } }>
                <DataRowsGroups
                    rows={ rows }
                    renderRow={ renderRow }
                    top={ headerRef?.current?.clientHeight }
                />
            </div>
        </div>
    );
}
