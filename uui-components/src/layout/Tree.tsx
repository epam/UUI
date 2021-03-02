import * as React from 'react';
import {IHasCX, IHasChildren, IEditable, ArrayDataSource, TreeNode, getSearchFilter, IAnalyticableOnChange, uuiContextTypes, UuiContexts} from "@epam/uui";
import clone from 'lodash.clone';
import isEqual from 'lodash.isequal';

export interface TreeNodeProps extends TreeNode<any, string> {
    data: any;
    depth: number;
    isDropdown?: boolean;
    isOpen?: boolean;
    onClick(): any;
}

export interface TreeListItem {
    id?: any;
    data?: any;
    parentId?: string;
}

export interface TreeProps extends IHasCX, IHasChildren, IEditable<string[]>, IAnalyticableOnChange<string[]> {
    items: TreeListItem[];
    renderRow(row: TreeNodeProps): any;
    search?: string;
}

interface TreeState {
    list: TreeNodeProps[];
}

export class Tree extends React.Component<TreeProps, TreeState> {
    static contextTypes = uuiContextTypes;
    context: UuiContexts;
    
    dataSource: ArrayDataSource;

    constructor(props: TreeProps) {
        super(props);

        this.dataSource = new ArrayDataSource({
            items: this.props.items,
        });
        this.state = {
            list: this.getListRecursive(),
        };
    }
    
    public componentDidUpdate(prevProps: TreeProps) {
        if (prevProps.search !== this.props.search || !isEqual(prevProps.value, this.props.value)) {
            this.setState({list: this.getListRecursive()});
        }
    }

    toggleFolding = (item: TreeListItem) => {
        const isUnfolded = this.props.value.includes(item.id);
        let value: string[];

        if (isUnfolded) {
            value = this.props.value.filter(i => i !== item.id);
            this.props.onValueChange(value);
        } else {
            value = clone(this.props.value);
            value.push(item.id);
            this.props.onValueChange(value);
        }
        
        if (this.props.getValueChangeAnalyticsEvent) {
            const event = this.props.getValueChangeAnalyticsEvent(value, this.props.value);
            this.context.uuiAnalytics.sendEvent(event);
        } 
    }

    getListRecursive() {
        const flatList: TreeNodeProps[] = [];
        this.dataSource.rootNodes.forEach(i => flatList.push(...this.getNodes(i, 0)));
        return flatList;
    }

    getNodes(item: TreeNode<any, string>, depth: number) {
        const items: TreeNodeProps[] = [];
        const isUnfolded = this.props.value.includes(item.id);
        const applySearch = this.props.search && getSearchFilter(this.props.search);
        const isPassedSearch = applySearch ? applySearch([(item.item as any).name]) : true;
        let children: TreeNodeProps[] = [];

        if (item.children && item.children.length) {
            item.children.forEach(i => children.push(...this.getNodes(i, depth + 1)));
        }
        
        if (!this.props.value.includes(item.id)) {
            if (applySearch && children.length > 0) {
                this.props.onValueChange([...this.props.value, item.id]);
            }
        }

        if (isPassedSearch || children.length > 0) {
            items.push({
                ...item,
                data: item.item,
                depth: depth,
                isDropdown: item.children && !!item.children.length,
                isOpen: isUnfolded,
                onClick: () => this.toggleFolding(item),
            });
        }


        if (item.children && item.children.length && isUnfolded) {
            items.push(...children);
        }

        return items;
    }

    render() {
        return (
            <>
                { this.state.list.map((i) => this.props.renderRow(i)) }
            </>
        );
    }
}