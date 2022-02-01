import * as React from 'react';
import * as css from './Sidebar.scss';
import { ScrollBars, SearchInput } from '@epam/promo';
import { Tree, TreeListItem, TreeNodeProps } from '@epam/uui-components';
import { SidebarButton } from './SidebarButton';
import { Link, useUuiContext } from "@epam/uui";
import { analyticsEvents } from "../../analyticsEvents";

export interface SidebarProps<TItem extends TreeListItem = TreeListItem> {
    value: string;
    onValueChange: (newVal: TreeNodeProps<TItem>) => void;
    getItemLink?: (item: TreeNodeProps<TItem>) => Link;
    items: TItem[];
    renderSearch?: () => React.ReactNode;
}

export function Sidebar<TItem extends TreeListItem>(props: SidebarProps<TItem>) {
    const { uuiAnalytics } = useUuiContext();
    const [searchValue, setSearchValue] = React.useState<string>('');
    const [unfoldedIds, setUnfoldedIds] = React.useState<string[]>([]);

    React.useEffect(() => {
        const { parentId } = props.items.find(i => i.id === props.value);
        if (!unfoldedIds.includes(parentId) && parentId !== undefined) {
            setUnfoldedIds([...unfoldedIds, parentId]);
        }
    }, [props.value]);

    const handleClick = React.useCallback((item: TreeNodeProps) => {
        item.isDropdown && item.onClick();
        const type = item.isDropdown ? 'folder' : 'document';
        uuiAnalytics.sendEvent(analyticsEvents.document.clickDocument(type, item.data.name, item.parentId));
    }, []);

    return (
        <aside className={ css.root }>
            <SearchInput
                cx={ css.search }
                value={ searchValue }
                onValueChange={ setSearchValue }
                autoFocus
                placeholder='Search'
                getValueChangeAnalyticsEvent={ value => analyticsEvents.document.search(value) }
            />
            <div className={ css.tree } role='tablist'>
                <ScrollBars>
                    <Tree<TItem>
                        items={ props.items }
                        value={ unfoldedIds }
                        search={ searchValue }
                        onValueChange={ setUnfoldedIds }
                        renderRow={ item => (
                            <SidebarButton
                                link={ props.getItemLink(item) }
                                indent={ item.depth * 12 }
                                isOpen={ item.isOpen }
                                isDropdown={ item.isDropdown }
                                isActive={ item.id === props.value }
                                caption={ item.data.name }
                                onClick={ () => handleClick(item) }
                            />
                        ) }
                    />
                </ScrollBars>
            </div>
        </aside>
    );
}