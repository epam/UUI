import type { Placement } from '@floating-ui/react';

export const getOppositePlacement = (inputPlacement: Placement): Placement => {
    const placementDirection = inputPlacement.split('-')[0];
    switch (placementDirection) {
        case 'bottom': return inputPlacement.replace('bottom', 'top') as Placement;
        case 'top': return inputPlacement.replace('top', 'bottom') as Placement;
        case 'left': return inputPlacement.replace('left', 'right') as Placement;
        case 'right': return inputPlacement.replace('right', 'left') as Placement;
        default: return inputPlacement;
    }
};

export const getFallbackPlacements = (inputPlacement: Placement): Placement[] => {
    const [direction, alignment] = inputPlacement.split('-');
    const fallbacks: Placement[] = [];

    // If there's an alignment (start/end), add variants with flipped alignments
    if (alignment) {
        const oppositeAlignment = alignment === 'start' ? 'end' : 'start';
        // Add same direction with opposite alignment
        fallbacks.push(`${direction}-${oppositeAlignment}` as Placement);
    }

    // Add opposite placement as second fallback
    fallbacks.push(getOppositePlacement(inputPlacement));

    // If there's an alignment, add opposite direction with opposite alignment
    if (alignment) {
        const oppositeAlignment = alignment === 'start' ? 'end' : 'start';
        const oppositeDirection = getOppositePlacement(`${direction}` as Placement).split('-')[0];
        fallbacks.push(`${oppositeDirection}-${oppositeAlignment}` as Placement);
    }

    const possiblePlacments = [
        'bottom-start',
        'bottom',
        'bottom-end',
        'right-end',
        'right',
        'right-start',
        'top-end',
        'top',
        'top-start',
        'left-start',
        'left',
        'left-end',
    ] as Placement[];

    // Reorder placements by shifting array to start after input placement
    const inputIndex = possiblePlacments.indexOf(inputPlacement);
    if (inputIndex !== -1) {
        // Create a new array with elements shifted so input placement is at the end
        // [1,2,3,4,5] with index 2 becomes [3,4,5,1,2]
        const reorderedPlacements = [
            ...possiblePlacments.slice(inputIndex + 1),
            ...possiblePlacments.slice(0, inputIndex),
        ];

        // Add only placements that aren't already in fallbacks
        reorderedPlacements.forEach((pl) => {
            if (!fallbacks.includes(pl) && pl !== inputPlacement) {
                fallbacks.push(pl);
            }
        });
    }

    return fallbacks;
};
