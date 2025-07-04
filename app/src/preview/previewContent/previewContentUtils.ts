import { DocBuilder, PropDocPropsUnknown, TComponentPreview, TDocConfig, TPreviewCellSize, componentsStructure } from '@epam/uui-docs';
import { SCREENSHOT_WIDTH_LIMIT } from '../constants';

const compMap = componentsStructure.reduce<Map<string, TDocConfig >>((acc, entry) => {
    const config = entry?.explorerConfig;
    if (config) {
        acc.set(entry.id, config);
    }
    return acc;
}, new Map());

export function getConfigByComponentId(componentId: string | undefined): TDocConfig | undefined {
    return compMap.get(componentId);
}

export function calcLayoutCssFromCellSize(
    params: { cellSize: TPreviewCellSize, totalNumberOfCells: number },
): { cellWidth: string; cellHeight: string; layoutWidth: string; } {
    const { cellSize, totalNumberOfCells } = params;
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
}

export function buildRenderCaseArr(
    docs: undefined | DocBuilder<PropDocPropsUnknown>,
    previewId: undefined | string | TComponentPreview<unknown>,
) {
    if (docs && previewId) {
        if (typeof previewId === 'object') {
            const rc = DocBuilder.convertPreviewPropsItemToRenderCases(previewId, docs);
            if (rc && !rc.props.length) {
                return { ...rc, props: [{}] };
            }
            return rc;
        } else {
            const arr = docs.getPreviewRenderCaseGroups();
            return arr?.find(({ id }) => {
                return id === previewId;
            });
        }
    }
}
