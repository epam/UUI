import * as React from "react";
import { DataColumnProps, IClickable, IHasCX, IHasRawProps, ScrollManager, uuiMarkers, Link, uuiContextTypes, UuiContexts } from "@epam/uui";
import { FlexRow } from '../layout';
import * as css from './DataTableRowContainer.scss';
import { Anchor } from '../navigation/Anchor';

export interface DataTableRowContainerProps extends IClickable, IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    scrollManager?: ScrollManager;
    columns?: DataColumnProps<any, any>[];
    renderCell?(column: DataColumnProps<any, any>, idx: number): React.ReactNode;
    wrapScrollingSection?(content: React.ReactNode, style: React.CSSProperties, scrollRef: (node: Node) => void): React.ReactNode;
    renderConfigButton?(): React.ReactNode;
    overlays?: React.ReactNode;
    link?: Link;
}

const uuiDataTableRowContainer = {
    uuiTableRowContainer: 'uui-table-row-container',
};

export class DataTableRowContainer extends React.Component<DataTableRowContainerProps, {}> {
    static contextTypes = uuiContextTypes;
    context: UuiContexts;

    scrollNode: HTMLElement | null = null;

    attachNode(node: HTMLElement) {
        this.props.scrollManager && this.scrollNode && this.props.scrollManager.detachNode(this.scrollNode);
        this.scrollNode = node;
        node && this.props.scrollManager && this.props.scrollManager.attachNode(node);
    }

    componentWillUnmount() {
        this.props.scrollManager && this.scrollNode && this.props.scrollManager.detachNode(this.scrollNode);
    }

    protected renderCells(columns: DataColumnProps<any>[]) {
        let cells = [];
        for (let n = 0; n < columns.length; n++) {
            const column = columns[n];
            let idx = 0;
            if (this.props.columns) {
                idx = this.props.columns.indexOf(column);
            }
            // console.log(n, column, this.props.renderCell(column, idx));
            cells.push(this.props.renderCell(column, idx));
        }
        return cells;
    }

    wrapScrollingSection(content: React.ReactNode, style: React.CSSProperties, scrollRef: (node: Node) => void) {
        return (
            <div key='ss' className={ css.scrollableColumnsWrapper } style={ style }>
                <div key='sc' className={ css.scrollableColumnsContainer } ref={ scrollRef }>
                    { content }
                </div>
                <div key='sl' className={ css.scrollShadowLeft } />
                <div key='sr' className={ css.scrollShadowRight } />
            </div>
        );
    }

    render() {
        const fixedLeftColumns: DataColumnProps<any, any>[] = [];
        const fixedRightColumns: DataColumnProps<any, any>[] = [];
        const scrollableColumns: DataColumnProps<any, any>[] = [];
        const scrollableStyle = {
            flexGrow: 100,
            flexShrink: 1,
            minWidth: 0,
            width: 0,
        };

        this.props.columns && this.props.columns.forEach(i => {
            if (i.fix === 'left') {
                fixedLeftColumns.push(i);
            } else if (i.fix === 'right') {
                fixedRightColumns.push(i);
            } else {
                scrollableColumns.push(i);
            }
        });
        
        const scrollingCells = (
            <FlexRow>
                { this.renderCells(scrollableColumns) }
            </FlexRow>
        );

        const scrollRef = (node: Node) => this.attachNode(node as HTMLElement);

        const scrollingSection = this.props.wrapScrollingSection
            ? this.props.wrapScrollingSection(scrollingCells, scrollableStyle, scrollRef)
            : this.wrapScrollingSection(scrollingCells, scrollableStyle, scrollRef);

        const rowContent = <>
            { this.renderCells(fixedLeftColumns) }
            { scrollingSection }
            { this.renderCells(fixedRightColumns) }
            { this.props.overlays }
            { this.props.renderConfigButton && this.props.renderConfigButton() }
        </>;

        return (
            this.props.link ?
                <Anchor
                    link={ this.props.link }
                    cx={ [css.container, uuiDataTableRowContainer.uuiTableRowContainer, this.props.onClick && uuiMarkers.clickable, this.props.cx] }
                    rawProps={ this.props.rawProps }
                >
                    { rowContent }
                </Anchor>
            :
                <FlexRow
                    onClick={ this.props.onClick }
                    cx={ [css.container, uuiDataTableRowContainer.uuiTableRowContainer, this.props.onClick && uuiMarkers.clickable, this.props.cx] }
                    rawProps={ this.props.rawProps }
                >
                    { rowContent }
                </FlexRow>
        );
    }
}