import * as React from 'react';
import {
    FlexCell,
    FlexRow,
    Spinner, Text, ErrorAlert,
} from '@epam/uui';
//
import css from './previewLayout.module.scss';
import { useCallback, useMemo } from 'react';
import { cx } from '@epam/uui-core';
import {
    SCREENSHOT_WIDTH_LIMIT,
} from '../constants';
import { TPreviewCellSize } from '@epam/uui-docs';

interface IPreviewLayout {
    error: string | undefined;
    isLoaded: boolean;
    renderCell: (params: { index: number }) => (React.ReactNode | undefined);
    totalNumberOfCells: number;
    cellSize: TPreviewCellSize | undefined;
}

const PREVIEW_REGION_ATTRS = {
    previewContentLabel: 'Preview Content',
    role: 'region',
};

export function PreviewLayout(props: IPreviewLayout) {
    const { renderCell, isLoaded, cellSize, totalNumberOfCells, error } = props;

    const renderErr = useCallback(() => {
        if (error) {
            return (
                <ErrorAlert>
                    <Text size="30">{ error }</Text>
                </ErrorAlert>

            );
        }
        return null;
    }, [error]);

    const layoutSize = useMemo(() => {
        let cellWidth: string;
        let cellHeight: string;
        let layoutWidth: string;
        if (cellSize) {
            const wh = cellSize.split('-').map((s) => parseInt(s));
            const requestedWidthPx = wh[0];
            const requestedHeightPx = wh[1];
            cellWidth = `${requestedWidthPx}px`;
            cellHeight = `${requestedHeightPx}px`;
            let numOfColumns = Math.floor(SCREENSHOT_WIDTH_LIMIT / requestedWidthPx);
            if (totalNumberOfCells && totalNumberOfCells < numOfColumns) {
                numOfColumns = totalNumberOfCells;
            }
            layoutWidth = `${numOfColumns * requestedWidthPx}px`;
        } else {
            cellWidth = 'auto';
            cellHeight = 'auto';
            layoutWidth = '100%';
        }
        return {
            cellWidth,
            cellHeight,
            layoutWidth,
        };
    }, [cellSize, totalNumberOfCells]);

    const renderAllCells = useCallback(() => {
        if (!isLoaded) {
            return null;
        }

        const withOutline = totalNumberOfCells > 1;

        return (
            <React.Fragment>
                {
                    new Array(totalNumberOfCells).fill(null).map((_, index) => {
                        return (
                            <div
                                data-index={ index }
                                key={ index }
                                className={ cx(css.cell, withOutline && css.withOutline) }
                                style={ { width: layoutSize.cellWidth, height: layoutSize.cellHeight } }
                            >
                                { renderCell({ index }) }
                            </div>
                        );
                    })
                }
            </React.Fragment>
        );
    }, [layoutSize, isLoaded, renderCell, totalNumberOfCells]);

    const attrs = {
        role: 'region',
        'aria-label': PREVIEW_REGION_ATTRS.previewContentLabel,
        'aria-busy': !isLoaded,
    };
    const style = { width: layoutSize.layoutWidth };

    return (
        <FlexRow cx={ css.root } rawProps={ attrs }>
            {
                !isLoaded && (
                    <div className={ css.spinner }>
                        <Spinner />
                    </div>
                )
            }
            {
                isLoaded && (
                    <FlexCell cx={ css.previewWrapper } rawProps={ { style } }>
                        { renderErr() }
                        <div className={ cx(css.preview) }>
                            { renderAllCells() }
                        </div>
                    </FlexCell>
                )
            }
        </FlexRow>
    );
}
