import React, { useCallback, useState } from 'react';
import {
    DataSourceState,
    useArrayDataSource,
    uuiMarkers,
    uuiElement,
    uuiMod,
} from '@epam/uui-core';
import { ReactComponent as FoldingArrow } from '@epam/assets/icons/navigation-chevron_down-outline.svg';
import css from './CustomHierarchicalList.module.scss';
import { Text, Panel, VirtualList, TextPlaceholder, IconContainer } from '@epam/uui';
import classNames from 'classnames';

interface Task {
    id: number;
    parentId?: number;
    name: string;
    tasksCount?: number;
}

const tasks: Task[] = [
    { id: 1, name: 'Infrastructure' },
    { id: 101, name: 'Devops', parentId: 1 },
    { id: 102, name: 'Frontend', parentId: 1 },
    { id: 10101, name: 'GIT Repository init', parentId: 101 },
    { id: 10103, name: 'Test instances - Dev, QA, UAT', parentId: 101 },
    { id: 10102, name: 'CI - build code, publish artifacts', parentId: 101 },
    { id: 10104, name: 'API connection & secrets management', parentId: 101 },
    { id: 10105, name: 'Production instance', parentId: 101 },
    { id: 10201, name: 'Init CRA project', parentId: 102 },
    { id: 10202, name: 'Decide and document coding practices and processes', parentId: 102 },
    { id: 301, name: 'Color palette', parentId: 3 },
    { id: 302, name: 'Core color tokens', parentId: 3 },
    { id: 303, name: 'Components tuning', parentId: 3 },
    { id: 304, name: 'Custom components modifiers', parentId: 3 },
    { id: 401, name: 'Accordion (foldable panel/section)', parentId: 4 },
    { id: 402, name: 'Alert', parentId: 4 },
    { id: 403, name: 'Attribute/Value section', parentId: 4 },
    { id: 404, name: 'Breadcrumbs', parentId: 4 },
    { id: 405, name: 'Dashboard Cards Elements', parentId: 4 },
    { id: 406, name: 'Forms headers/sub-headers', parentId: 4 },
    { id: 407, name: 'Icons', parentId: 4 },
    { id: 408, name: 'Masked input', parentId: 4 },
    { id: 409, name: 'Master-detail screen', parentId: 4 },
    { id: 410, name: 'Common Modal windows (e.g. confirmation)', parentId: 4 },
    { id: 411, name: 'Stepper', parentId: 4 },
    { id: 412, name: 'In-form Tables', parentId: 4 },
    { id: 413, name: 'User card', parentId: 4 },
    { id: 414, name: 'Top-level navigation', parentId: 4 },
    { id: 501, name: 'Page layout components', parentId: 5 },
    { id: 502, name: 'Master-detail', parentId: 5 },
    { id: 503, name: 'Full-screen table', parentId: 5 },
    { id: 504, name: 'Full-screen form', parentId: 5 },
    { id: 505, name: 'Dashboard', parentId: 5 },
    { id: 506, name: 'Catalog', parentId: 5 },
    { id: 601, name: 'Home', parentId: 6 },
    { id: 602, name: 'Catalog', parentId: 6 },
    { id: 603, name: 'Product Details', parentId: 6 },
    { id: 604, name: 'Favorites', parentId: 6 },
    { id: 605, name: 'Comparison', parentId: 6 },
    { id: 606, name: 'Check-out form', parentId: 6 },
    { id: 60701, name: 'Products List', parentId: 607 },
    { id: 60702, name: 'Product Form', parentId: 607 },
    { id: 60703, name: 'Sales report', parentId: 607 },
    { id: 60704, name: 'Marketing dashboard', parentId: 607 },
    { id: 60705, name: 'Categories list editor', parentId: 607 },
    { id: 201, name: 'Authentication', parentId: 2 },
    { id: 202, name: 'Integration with API', parentId: 2 },
    { id: 203, name: 'Routing', parentId: 2 },
    { id: 204, name: 'Localization', parentId: 2 },
    { id: 2, name: 'Shared services' },
    { id: 3, name: 'UUI Customization' },
    { id: 4, name: 'Shared Components' },
    { id: 5, name: 'Pages Template Components' },
    { id: 6, name: 'Pages' },
    { id: 607, name: 'Admin area', parentId: 6 },
];

export default function CitiesTable() {
    const [listState, setListState] = useState<DataSourceState>({
        visibleCount: 20, // how many items to load initially?
    });

    // Create DataSource instance for your table.
    // For more details go to the DataSources example
    const tasksDs = useArrayDataSource<Task, number, unknown>(
        { 
            items: tasks,
            isFoldedByDefault: () => false,
            getParentId: ({ parentId }) => parentId,
        },
        [],
    );

    // Create View according to your tableState and options
    const view = tasksDs.useView(listState, setListState, {
        getRowOptions: useCallback(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (item) => ({ isSelectable: true }), // can set row options here
            [],
        ),
    });
    const rows = view.getVisibleRows().map((row) => {
        let content: React.ReactNode;
        if (row.isLoading) {
            content = <TextPlaceholder />;
        } else {
            content = (
                <Text fontWeight="600" fontSize="16">
                    {row.value.name}
                </Text>
            );
        }
        
        const getIndent = () => {
            return 12 + (row.indent - 1) * 24;
        };
    
        return (
            <div
                key={ row.id }
                className={
                    classNames(
                        uuiMarkers.clickable,
                        row.id === listState.selectedId ? uuiMod.selected : undefined,
                        css.row,
                    )
                }
                onClick={ row.isFoldable ? (() => row.onFold(row)) : (() => row.onSelect(row)) }
            > 
                {
                    row.indent > 0 && (
                        <div key="fold" className="uui-dr_addons-indent" style={ { marginInlineStart: getIndent(), width: 18 } }>
                            {row.isFoldable && (
                                <IconContainer
                                    rawProps={ {
                                        'aria-label': row.isFolded ? 'Unfold' : 'Fold',
                                        role: 'button',
                                    } }
                                    key="icon"
                                    icon={ FoldingArrow }
                                    cx={ [
                                        uuiElement.foldingArrow, uuiMarkers.clickable,
                                    ] }
                                    style={ { fill: 'var(--uui-icon)' } }
                                    rotate={ row.isFolded ? '90ccw' : '0' }
                                    onClick={ () => row.onFold(row) }
                                    size={ 18 }
                                />
                            )}
                        </div>
                    )
                }
                {content}
            </div>
        );
    });

    return (
        <Panel
            shadow
            style={ {
                height: '300px',
                width: '400px',
            } }
        >
            <VirtualList
                value={ listState }
                onValueChange={ setListState }
                rows={ rows }
                rowsCount={ view.getListProps().rowsCount }
            />
        </Panel>
    );
}
