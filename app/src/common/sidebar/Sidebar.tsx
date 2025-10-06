import React, { useEffect } from 'react';
import { DataRowProps, DataSourceState, Link, useUuiContext, useArrayDataSource } from '@epam/uui-core';
import { DocItem } from '@epam/uui-docs';
import { Badge, SearchInput, Tree } from '@epam/uui';
import { analyticsEvents } from '../../analyticsEvents';
import css from './Sidebar.module.scss';

export interface SidebarProps<TItem extends DocItem> {
    value: string;
    onValueChange: (newVal: DataRowProps<DocItem, string>) => void;
    getItemLink?: (item: DocItem) => Link;
    items: TItem[];
    renderSearch?: () => React.ReactNode;
    getSearchFields?(item: TItem): string[];
}

function getItemParents<TItem extends DocItem>(allItems: TItem[], itemId: string): string[] {
    const item = allItems.find((i) => i.id === itemId);
    const parents = [];
    if (item?.parentId) {
        parents.push(item.parentId);
        const otherParents = getItemParents(allItems, item.parentId);
        parents.push(...otherParents);
    }
    return parents;
}

export function Sidebar(props: SidebarProps<DocItem>) {
    const { uuiAnalytics } = useUuiContext();
    const [value, setValue] = React.useState<DataSourceState>({ search: '', folded: {}, selectedId: props.value });

    const dataSource = useArrayDataSource<DocItem, string, unknown>(
        {
            items: props.items,
            getId: (item) => item.id,

        },
        [props.items],
    );

    const view = dataSource.useView(value, setValue, {
        getSearchFields: props.getSearchFields,
        getRowOptions: (item) => {
            return {
                isSelectable: !!(item.examples || item.component || item.renderContent),
                link: props.getItemLink && (item.examples || item.component || item.renderContent) ? props.getItemLink(item) : undefined,
            };
        },

    });

    useEffect(() => {
        if (props.items) {
            const parents = getItemParents(props.items, props.value);
            if (parents.length > 0) {
                const unfold = parents.reduce<Record<string, boolean>>((acc, parentId) => {
                    acc[parentId] = false;
                    return acc;
                }, {});
                setValue((stateValue) => ({ ...stateValue, folded: { ...stateValue.folded, ...unfold } }));
            }
        }
    }, [props.value, props.items]);

    useEffect(() => {
        const item = dataSource.getById(props.value);
        if (item) {
            uuiAnalytics.sendEvent(analyticsEvents.document.clickDocument('document', item.name, item.parentId));
        }
    }, [props.value, dataSource, uuiAnalytics]);

    return (
        <aside className={ css.root }>
            <SearchInput
                cx={ css.search }
                value={ value.search }
                onValueChange={ (search) => setValue((v) => ({ ...v, search })) }
                autoFocus
                placeholder="Search"
                getValueChangeAnalyticsEvent={ (val) => analyticsEvents.document.search(val) }
            />
            <div className={ css.tree } role="tablist">
                <Tree<DocItem>
                    value={ value }
                    onValueChange={ setValue }
                    view={ view }
                    size="36"
                    getCaption={ (item) => item.name }
                    renderAddons={ (item) => item.value.markIsNew && <Badge size="18" caption="New" fill="outline" color="success" /> }
                />
            </div>
        </aside>
    );
}
