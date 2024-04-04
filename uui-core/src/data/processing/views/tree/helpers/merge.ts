import { newMap } from './map';

export interface MergeOptions<TId> {
    isDeleted?: (id: TId) => boolean;
    complexIds?: boolean;
}

export function merge<TId>(
    mergeSrcArr: TId[],
    mergeTgArr: TId[],
    compare: (idFromSource: TId, idFromTarget: TId, sourceIndex: number, targetIndex: number) => number,
    initialArr: TId[] = [],
    options: MergeOptions<TId> = {},
): [TId[], boolean] {
    const { complexIds, isDeleted } = options;

    let srcItemIndex = 0,
        tgItemIndex = 0,
        isUpdated = false;

    const merged: TId[] = [...initialArr];
    const patchedItems = newMap<TId, boolean>({ complexIds });

    mergeSrcArr.forEach((id) => {
        patchedItems.set(id, true);
    });

    while (srcItemIndex < mergeSrcArr.length || tgItemIndex < mergeTgArr.length) {
        if (srcItemIndex >= mergeSrcArr.length) {
            if (!patchedItems.get(mergeTgArr[tgItemIndex]) && !isDeleted?.(mergeTgArr[tgItemIndex])) {
                merged.push(mergeTgArr[tgItemIndex]);
            }
            if (isDeleted?.(mergeTgArr[tgItemIndex])) {
                isUpdated = true;
            }

            tgItemIndex++;
            continue;
        }

        if (tgItemIndex >= mergeTgArr.length) {
            if (!isDeleted?.(mergeSrcArr[srcItemIndex])) {
                merged.push(mergeSrcArr[srcItemIndex]);
                isUpdated = true;
            }
            srcItemIndex++;
            continue;
        }

        const srcItemId = mergeSrcArr[srcItemIndex];
        const tgItemId = mergeTgArr[tgItemIndex];

        if (isDeleted?.(srcItemId)) {
            srcItemIndex++;
            continue;
        }

        if (isDeleted?.(tgItemId)) {
            isUpdated = true;
            tgItemIndex++;
            continue;
        }

        if (patchedItems.has(tgItemId)) {
            isUpdated = true;
            tgItemIndex++;
            continue;
        }

        const result = compare(srcItemId, tgItemId, srcItemIndex, tgItemIndex);
        if (result === -1) {
            merged.push(srcItemId);
            isUpdated = true;
            srcItemIndex++;
        } else {
            if (!patchedItems.has(tgItemId) && !isDeleted?.(tgItemId)) {
                merged.push(tgItemId);
            }
            if (isDeleted?.(tgItemId)) {
                isUpdated = true;
            }

            tgItemIndex++;
        }
    }

    return [merged, isUpdated];
}
