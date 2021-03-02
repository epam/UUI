import * as React from 'react';
import * as css from './Sidebar.scss';
import { ScrollBars, SearchInput } from '@epam/promo';
import { Tree, TreeNodeProps } from '@epam/uui-components';
import { SidebarButton } from './SidebarButton';
import { Link } from "@epam/uui";
import {svc} from "../../services";
import {analyticsEvents} from "../../analyticsEvents";

export interface SidebarProps {
    value: string;
    onValueChange: (newVal: TreeNodeProps) => any;
    getItemLink?: (item: TreeNodeProps) => Link;
    items: any[];
    renderSearch?: () => React.ReactNode;
}

interface SidebarState {
    searchValue: string;
    unfoldedIds: string[];
}

export class Sidebar extends React.Component<SidebarProps, SidebarState> {
    state: SidebarState = {
        searchValue: '',
        unfoldedIds: this.props.items.find(i => i.id === this.props.value).parentId ? [this.props.items.find(i => i.id === this.props.value).parentId] : [],
    };

    componentDidUpdate(prevProps: Readonly<SidebarProps>, prevState: Readonly<SidebarState>) {
        const parentId = this.props.items.find(i => i.id === this.props.value).parentId;

        if (prevProps.value !== this.props.value) {
            if (!this.state.unfoldedIds.includes(parentId) && parentId !== undefined) {
                this.setState({
                    unfoldedIds: [...this.state.unfoldedIds, parentId],
                });
            }
        }
    }
    
    handleClick = (item: TreeNodeProps) => {
        item.isDropdown && item.onClick();
        const type = item.isDropdown ? 'folder' : 'document';
        svc.uuiAnalytics.sendEvent(analyticsEvents.document.clickDocument(type, item.data.name, item.parentId));
    }
    
    getSearchEvent = (value: string) => {
        return analyticsEvents.document.search(value);
    }

    render() {
        return (
            <div className={ css.root } >
                <SearchInput value={ this.state.searchValue } onValueChange={ (val) => this.setState({ searchValue: val }) } autoFocus={ true } placeholder='Search' cx={ css.search } getValueChangeAnalyticsEvent={ this.getSearchEvent } />
                <div className={ css.tree } >
                    <ScrollBars >
                        <Tree
                            items={ this.props.items }
                            value={ this.state.unfoldedIds }
                            onValueChange={ (value) => this.setState({ unfoldedIds: value }) }
                            renderRow={ (item) => <SidebarButton
                                link={ this.props.getItemLink(item) }
                                indent={ item.depth * 12 }
                                isOpen={ item.isOpen }
                                isDropdown={ item.isDropdown }
                                isActive={ item.id === this.props.value }
                                key={ item.id }
                                caption={ item.data.name }
                                onClick={ () => this.handleClick(item) }
                            />
                            }
                            search={ this.state.searchValue }
                        />
                    </ScrollBars>
                </div>
            </div>
        );
    }
}