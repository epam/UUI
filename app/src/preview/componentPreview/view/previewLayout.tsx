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
    CELL_SIZE_DEFAULT,
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
        let requestedWidthPx;
        let requestedHeightPxOrStr;
        if (cellSize) {
            const wh = cellSize.split('-').map((s) => parseInt(s));
            requestedWidthPx = wh[0];
            requestedHeightPxOrStr = wh[1];
        } else {
            requestedWidthPx = CELL_SIZE_DEFAULT.width;
            requestedHeightPxOrStr = CELL_SIZE_DEFAULT.height;
        }

        const cellWidth = `${requestedWidthPx}px`;
        const cellHeight = typeof requestedHeightPxOrStr === 'number' ? `${requestedHeightPxOrStr}px` : requestedHeightPxOrStr;

        let numOfColumns = Math.floor(SCREENSHOT_WIDTH_LIMIT / requestedWidthPx);
        if (totalNumberOfCells && totalNumberOfCells < numOfColumns) {
            numOfColumns = totalNumberOfCells;
        }

        return {
            cellWidth,
            cellHeight,
            layoutFixedWidth: `${numOfColumns * requestedWidthPx}px`,
        };
    }, [cellSize, totalNumberOfCells]);

    const renderAllCells = useCallback(() => {
        if (!isLoaded) {
            return null;
        }

        return (
            <React.Fragment>
                {
                    new Array(totalNumberOfCells).fill(null).map((_, index) => {
                        return (
                            <div data-index={ index } key={ index } className={ css.cell } style={ { width: layoutSize.cellWidth, height: layoutSize.cellHeight } }>
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
                    <FlexCell cx={ css.previewWrapper } rawProps={ { style: { width: layoutSize.layoutFixedWidth } } }>
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
