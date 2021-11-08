import * as React from "react";
import { DataColumnProps, IClickable, IHasCX, IHasRawProps, uuiMarkers, Link } from "@epam/uui";
import { FlexRow } from '../layout';
import * as css from './DataTableRowContainer.scss';
import { Anchor } from '../navigation/Anchor';

export interface DataTableRowContainerProps extends IClickable, IHasCX, IHasRawProps<HTMLAnchorElement | HTMLDivElement> {
    columns?: DataColumnProps<any, any>[];
    renderCell?(column: DataColumnProps<any, any>, idx: number): React.ReactNode;
    wrapScrollingSection?(content: React.ReactNode): React.ReactNode;
    renderConfigButton?(): React.ReactNode;
    overlays?: React.ReactNode;
    link?: Link;
}

const uuiDataTableRowContainer = {
    uuiTableRowContainer: 'uui-table-row-container',
};

export class DataTableRowContainer extends React.Component<DataTableRowContainerProps, {}> {
    protected renderCells(columns: DataColumnProps<React.ReactNode>[]) {
        return columns.reduce<React.ReactNode[]>((cells, column) => {
            const idx = this.props.columns?.indexOf(column) || 0;
            return cells.concat(this.props.renderCell(column, idx));
        }, []);
    }

    wrapScrollingSection(content: React.ReactNode) {
        return (
            <div key='ss' className={ css.scrollableColumnsWrapper }>
                <div key='sc' className={ css.scrollableColumnsContainer }>
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

        this.props.columns?.forEach(i => {
            if (i.fix === 'left') fixedLeftColumns.push(i);
            else if (i.fix === 'right') fixedRightColumns.push(i);
            else scrollableColumns.push(i);
        });

        const scrollingCells = (
            <FlexRow alignItems='top' >
                { this.renderCells(scrollableColumns) }
            </FlexRow>
        );

        const scrollingSection = this.props.wrapScrollingSection
            ? this.props.wrapScrollingSection(scrollingCells)
            : this.wrapScrollingSection(scrollingCells);

        const rowContent = <>
            { this.renderCells(fixedLeftColumns) }
            { scrollingSection }
            { this.renderCells(fixedRightColumns) }
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