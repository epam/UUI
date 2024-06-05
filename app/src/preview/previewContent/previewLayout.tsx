import React, { useMemo, useRef } from 'react';
import { cx } from '@epam/uui-core';
import { TPreviewCellSize } from '@epam/uui-docs';
import { FlexCell, FlexRow, Spinner, Text, ErrorAlert } from '@epam/uui';
import { calcLayoutCssFromCellSize } from './previewContentUtils';
//
import css from './previewLayout.module.scss';

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

    const ref = useRef();
    const handleLayoutClick = (e: Event) => {
        if (ref.current === e.target) {
            props.onOpenConfig();
        }
    };

    return (
        <FlexRow cx={ css.root } rawProps={ getPreviewRegionAttrs(isLoaded) } onClick={ handleLayoutClick } ref={ ref }>
            { renderContent() }
        </FlexRow>
    );
}

function getPreviewRegionAttrs(isLoaded: boolean) {
    return {
        'aria-busy': !isLoaded,
        'aria-label': 'Preview Content',
        role: 'region',
    };
}
