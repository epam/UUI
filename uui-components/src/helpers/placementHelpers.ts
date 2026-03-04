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
    const [direction] = inputPlacement.split('-');
    const oppositeDirection = getOppositePlacement(direction as Placement).split('-')[0];

    const ALL_PLACEMENTS: Placement[] = [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
    ];

    const sameDir = ALL_PLACEMENTS.filter((p) => p.startsWith(direction) && p !== inputPlacement);
    const oppositeDir = ALL_PLACEMENTS.filter((p) => p.startsWith(oppositeDirection));
    const otherDir = ALL_PLACEMENTS.filter((p) => !p.startsWith(direction) && !p.startsWith(oppositeDirection));

    const fallbacks: Placement[] = [];
    const addUnique = (p: Placement) => {
        if (!fallbacks.includes(p)) fallbacks.push(p);
    };

    sameDir.forEach(addUnique);
    addUnique(getOppositePlacement(inputPlacement));
    oppositeDir.forEach(addUnique);
    otherDir.forEach(addUnique);

    return fallbacks;
};
