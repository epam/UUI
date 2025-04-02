import React, { useMemo, useRef } from 'react';
import { cx } from '@epam/uui-core';
import { TPreviewCellSize } from '@epam/uui-docs';
import { FlexCell, FlexRow, Spinner, Text, ErrorAlert } from '@epam/uui';
import { calcLayoutCssFromCellSize } from './previewContentUtils';
//
import css from './previewLayout.module.scss';
import { Page } from '../../common';

interface IPreviewLayout {
    error: string | undefined;
    isLoaded: boolean;
    renderCell: (params: { index: number }) => (React.ReactNode | undefined);
    totalNumberOfCells: number;
    cellSize: TPreviewCellSize | undefined;
    onOpenConfig: () => void;
}

export function PreviewLayout(props: IPreviewLayout) {
    const { renderCell, isLoaded, cellSize, totalNumberOfCells, error } = props;

    const layoutSize = useMemo(() => {
        return calcLayoutCssFromCellSize({ cellSize, totalNumberOfCells });
    }, [cellSize, totalNumberOfCells]);

    const renderContent = () => {
        if (!isLoaded) {
            return (
                <div className={ css.spinner }>
                    <Spinner />
                </div>
            );
        }
        const isShowOutline = totalNumberOfCells > 1;
        return (
            <FlexCell cx={ css.previewWrapper } rawProps={ { style: { width: layoutSize.layoutWidth } } }>
                {
                    error && (
                        <ErrorAlert>
                            <Text size="30">{ error }</Text>
                        </ErrorAlert>
                    )
                }
                <div className={ css.preview }>
                    {
                        new Array(totalNumberOfCells).fill(null).map((_, index) => {
                            return (
                                <div
                                    data-index={ index }
                                    key={ index }
                                    className={ cx(css.cell, isShowOutline && 'uui-preview-layout-cell-outline') }
                                    style={ { width: layoutSize.cellWidth, height: layoutSize.cellHeight } }
                                >
                                    { renderCell({ index }) }
                                </div>
                            );
                        })
                    }
                </div>
            </FlexCell>
        );
    };

    const wrapperRef = useRef<HTMLDivElement>(undefined);
    const layoutRef = useRef<HTMLDivElement>(undefined);
    const handleLayoutClick = (e: React.MouseEvent<HTMLElement>) => {
        if ([wrapperRef.current, layoutRef.current].includes(e.target as HTMLDivElement)) {
            props.onOpenConfig();
        }
    };

    return (
        <Page
            renderHeader={ () => null }
            rootCx={ css.root }
            wrapperRef={ wrapperRef }
            onClick={ handleLayoutClick }
        >
            <FlexRow cx={ css.layoutRoot } rawProps={ getPreviewRegionAttrs(isLoaded) } ref={ layoutRef }>
                { renderContent() }
            </FlexRow>
        </Page>
    );
}

function getPreviewRegionAttrs(isLoaded: boolean) {
    return {
        'aria-busy': !isLoaded,
        'aria-label': 'Page Content',
        role: 'region',
    };
}
