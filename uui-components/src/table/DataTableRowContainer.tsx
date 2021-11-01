import React, { CSSProperties, ReactNode, Component } from "react";
import { DataColumnProps, IClickable, IHasCX, IHasRawProps, ScrollManager, uuiMarkers, Link, cx } from "@epam/uui";
import { FlexRow } from '../layout';
import * as css from './DataTableRowContainer.scss';
import { Anchor } from '../navigation/Anchor';

export interface DataTableRowContainerProps<TItem, TId> extends IClickable, IHasCX, IHasRawProps<HTMLAnchorElement | HTMLDivElement> {
    scrollManager?: ScrollManager;
    columns?: DataColumnProps<TItem, TId>[];
    renderCell?(column: DataColumnProps<TItem, TId>, idx: number): ReactNode;
    wrapScrollingSection?(content: ReactNode, style: CSSProperties, scrollRef: (node: HTMLElement) => void): ReactNode;
    renderConfigButton?(): ReactNode;
    overlays?: ReactNode;
    link?: Link;
}

const uuiDataTableRowContainer = {
    uuiTableRowContainer: 'uui-table-row-container',
};

export class DataTableRowContainer<TItem, TId> extends Component<DataTableRowContainerProps<TItem, TId>, {}> {
    scrollNode: HTMLElement | null = null;

    attachNode = (node: HTMLElement) => {
        this.props.scrollManager && this.scrollNode && this.props.scrollManager.detachNode(this.scrollNode);
        this.scrollNode = node;
        node && this.props.scrollManager && this.props.scrollManager.attachNode(node);
    }

    componentWillUnmount() {
        this.props.scrollManager && this.scrollNode && this.props.scrollManager.detachNode(this.scrollNode);
    }

    protected renderCells = (columns: DataColumnProps<TItem, TId>[]) => {
        return columns.reduce<ReactNode[]>((cells, column) => {
            const idx = this.props.columns?.indexOf(column) || 0;
            return cells.concat(this.props.renderCell(column, idx));
        }, []);
    }

    wrapScrollingSection = (content: ReactNode, style: CSSProperties, scrollRef: (node: HTMLElement) => void) => (
        <div key='ss' className={ css.scrollableColumnsWrapper } style={ style }>
            <div key='sc' className={ css.scrollableColumnsContainer } ref={ scrollRef }>
                { content }
            </div>
            <div key='sl' className={ css.scrollShadowLeft } />
            <div key='sr' className={ css.scrollShadowRight } />
        </div>
    );

    wrapFixedSection = (columns: DataColumnProps<TItem, TId>[], direction: 'left' | 'right') => (
        <div className={ cx(css.fixedColumnsWrapper, {
            [css.fixedColumnsWrapperLeft]: direction === 'left',
            [css.fixedColumnsWrapperRight]: direction === 'right'
        }) }>
            { this.renderCells(columns) }
        </div>
    )

    render() {
        const fixedLeftColumns: DataColumnProps<TItem, TId>[] = [];
        const fixedRightColumns: DataColumnProps<TItem, TId>[] = [];
        const scrollableColumns: DataColumnProps<TItem, TId>[] = [];
        const scrollableStyle: CSSProperties = { flexGrow: 100, flexShrink: 1, minWidth: 0, width: 0 };

        this.props.columns?.forEach(col => {
            if (col.fix === 'left') fixedLeftColumns.push(col);
            else if (col.fix === 'right') fixedRightColumns.push(col);
            else scrollableColumns.push(col);
        });

        const scrollingCells = (
            <FlexRow alignItems='top'>
                { this.renderCells(scrollableColumns) }
            </FlexRow>
        );

        const scrollingSection = this.props.wrapScrollingSection
            ? this.props.wrapScrollingSection(scrollingCells, scrollableStyle, this.attachNode)
            : this.wrapScrollingSection(scrollingCells, scrollableStyle, this.attachNode);

        const rowContent = (
            <React.Fragment>
                { this.wrapFixedSection(fixedLeftColumns, 'left') }
                { scrollingSection }
                { this.wrapFixedSection(fixedRightColumns, 'right') }
                { this.props.overlays }
                { this.props.renderConfigButton?.() }
            </React.Fragment>
        );

        return (
            this.props.link ? (
                <Anchor
                    link={ this.props.link }
                    cx={ [css.container, uuiDataTableRowContainer.uuiTableRowContainer, this.props.onClick && uuiMarkers.clickable, this.props.cx] }
                    rawProps={ this.props.rawProps }
                >
                    { rowContent }
                </Anchor>
            ) : (
                <FlexRow
                    onClick={ this.props.onClick }
                    cx={ [css.container, uuiDataTableRowContainer.uuiTableRowContainer, this.props.onClick && uuiMarkers.clickable, this.props.cx] }
                    rawProps={ this.props.rawProps }
                    alignItems='top'
                >
                    { rowContent }
                </FlexRow>
            )
        );
    }
}