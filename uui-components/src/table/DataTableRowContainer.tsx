import * as React from "react";
import { DataColumnProps, IClickable, IHasCX, IHasRawProps, uuiMarkers, Link, cx, CX } from "@epam/uui";
import { FlexRow } from '../layout';
import * as css from './DataTableRowContainer.scss';
import { Anchor } from '../navigation/Anchor';

export interface DataTableRowContainerProps<TItem, TId> extends IClickable, IHasCX, IHasRawProps<HTMLAnchorElement | HTMLDivElement> {
    columns?: DataColumnProps<TItem, TId>[];
    renderCell?(column: DataColumnProps<TItem, TId>, idx: number): React.ReactNode;
    wrapScrollingSection?(content: React.ReactNode): React.ReactNode;
    renderConfigButton?(): React.ReactNode;
    overlays?: React.ReactNode;
    link?: Link;
}

const uuiDataTableRowContainer = {
    uuiTableRowContainer: 'uui-table-row-container',
};

export class DataTableRowContainer<TItem, TId> extends React.Component<DataTableRowContainerProps<TItem, TId>, {}> {
    protected renderCells(columns: DataColumnProps<React.ReactNode>[]) {
        return columns.reduce<React.ReactNode[]>((cells, column) => {
            const idx = this.props.columns?.indexOf(column) || 0;
            return cells.concat(this.props.renderCell(column, idx));
        }, []);
    }

    wrapScrollingSection = (content: React.ReactNode[]) => (
        <div className={ css.scrollableColumnsWrapper }>
            <div className={ css.scrollableColumnsContainer }>
                { content }
            </div>
            <div className={ css.scrollShadowLeft } />
            <div className={ css.scrollShadowRight } />
        </div>
    );

    wrapFixedSection = (content: React.ReactNode[], direction: 'left' | 'right') => (
        <>
            { content }
        </>
    )

    render() {
        const fixedLeftColumns: DataColumnProps<TItem, TId>[] = [];
        const fixedRightColumns: DataColumnProps<TItem, TId>[] = [];
        const scrollableColumns: DataColumnProps<TItem, TId>[] = [];

        this.props.columns?.forEach(i => {
            if (i.fix === 'left') fixedLeftColumns.push(i);
            else if (i.fix === 'right') fixedRightColumns.push(i);
            else scrollableColumns.push(i);
        });

        const scrollingSection = (
            this.props.wrapScrollingSection?.(this.renderCells(scrollableColumns)) ||
            this.wrapScrollingSection(this.renderCells(scrollableColumns))
        );

        const rowContent = <>
            { this.wrapFixedSection(this.renderCells(fixedLeftColumns), 'left') }
            { scrollingSection }
            { this.wrapFixedSection(this.renderCells(fixedRightColumns), 'right') }
            { this.props.overlays }
            { this.props.renderConfigButton?.() }
        </>;

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