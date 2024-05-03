import { PreviewPageParams } from '../types';

export function createUniqueTestName(
    params: { runId?: string, pageParams: PreviewPageParams },
) {
    const {
        runId = '',
        pageParams: {
            isSkin,
            theme,
            componentId,
            previewId,
        },
    } = params;

    return [
        runId,
        componentId,
        previewId,
        theme,
        (isSkin ? 'skin' : 'notSkin'),
    ].filter((i) => !!i).map((i) => normalizeNameToken(i)).join('-');
}

function normalizeNameToken(s: string) {
    return s
        .split(/[_\s]/).map((i) => `${capitalize(i)}`).join('')
        .replace(/[^A-Za-z0-9]/g, '');
}
function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
