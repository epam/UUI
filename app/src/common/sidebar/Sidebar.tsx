import * as React from 'react';
import css from './Sidebar.scss';
import { ScrollBars, SearchInput } from '@epam/promo';
import { Tree, TreeListItem } from '@epam/uui-components';
import { SidebarButton } from './SidebarButton';
import { DataRowProps, DataSourceState, Link, useUuiContext } from "@epam/uui";
import { analyticsEvents } from "../../analyticsEvents";

export interface SidebarProps<TItem extends TreeListItem = TreeListItem> {
    value: string;
    onValueChange: (newVal: DataRowProps<TItem, string>) => void;
    getItemLink?: (item: DataRowProps<TItem, string>) => Link;
    items: TItem[];
    renderSearch?: () => React.ReactNode;
}

export function Sidebar<TItem extends TreeListItem>(props: SidebarProps<TItem>) {
    const { uuiAnalytics } = useUuiContext();
    const [value, setValue] = React.useState<DataSourceState>({ search: '', folded: {} });

    React.useEffect(() => {
        const { parentId } = props.items.find(i => i.id == props.value);
        if (parentId != null) {
            const parentKey = JSON.stringify(parentId);
            setValue((value) => ({...value, folded: { ...value.folded, [ parentKey ]: false } }));
        }
    }, [props.value]);

    const handleClick = React.useCallback((row: DataRowProps<TItem, string>) => {
        row.isFoldable && row.onFold(row);
        const type = row.isFoldable ? 'folder' : 'document';
        uuiAnalytics.sendEvent(analyticsEvents.document.clickDocument(type, row.value.name, row.parentId));
    }, []);

    return (
        <aside className={ css.root }>
            <SearchInput
                cx={ css.search }
                value={ value.search }
                onValueChange={ (search) => setValue(v => ({ ...v, search }))}
                autoFocus
                placeholder='Search'
                getValueChangeAnalyticsEvent={ value => analyticsEvents.document.search(value) }
            />
            <div className={ css.tree } role='tablist'>
                <ScrollBars>
                    <Tree<TItem>
                        items={ props.items }
                        value={ value }
                        onValueChange={ setValue }
                        renderRow={ row => (
                            <SidebarButton
                                key={ row.key }
                                link={ props.getItemLink(row) }
                                indent={ (row.depth - 1) * 12 }
                                isOpen={ !row.isFolded }
                                isDropdown={ row.isFoldable }
                                isActive={ row.id === props.value }
                                caption={ row.value.name }
                                onClick={ () => handleClick(row) }
                            />
                        ) }
                    />
                </ScrollBars>
            </div>
        </aside>
    );
}
