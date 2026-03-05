import type { Placement } from '@floating-ui/react';
import { getFallbackPlacements, getOppositePlacement } from '../placementHelpers';

describe('getOppositePlacement', () => {
    it.each<[Placement, Placement]>([
        ['top', 'bottom'],
        ['bottom', 'top'],
        ['left', 'right'],
        ['right', 'left'],
        ['top-start', 'bottom-start'],
        ['bottom-end', 'top-end'],
        ['left-start', 'right-start'],
        ['right-end', 'left-end'],
    ])('returns %s -> %s', (input, expected) => {
        expect(getOppositePlacement(input)).toBe(expected);
    });
});

describe('getFallbackPlacements', () => {
    it.each<[Placement, [Placement, Placement, Placement]]>([
        ['top', ['top-start', 'top-end', 'bottom']],
        ['top-start', ['top', 'top-end', 'bottom-start']],
        ['top-end', ['top', 'top-start', 'bottom-end']],
        ['bottom', ['bottom-start', 'bottom-end', 'top']],
        ['bottom-start', ['bottom', 'bottom-end', 'top-start']],
        ['bottom-end', ['bottom', 'bottom-start', 'top-end']],
        ['left', ['left-start', 'left-end', 'right']],
        ['left-start', ['left', 'left-end', 'right-start']],
        ['left-end', ['left', 'left-start', 'right-end']],
        ['right', ['right-start', 'right-end', 'left']],
        ['right-start', ['right', 'right-end', 'left-start']],
        ['right-end', ['right', 'right-start', 'left-end']],
    ])('returns correct first 3 fallbacks for %s', (input, [first, second, third]) => {
        const result = getFallbackPlacements(input);
        expect(result[0]).toBe(first);
        expect(result[1]).toBe(second);
        expect(result[2]).toBe(third);
    });

    it('never includes the input placement itself', () => {
        const allPlacements: Placement[] = [
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
        allPlacements.forEach((p) => {
            expect(getFallbackPlacements(p)).not.toContain(p);
        });
    });

    it('returns exactly 11 fallbacks for every placement', () => {
        const allPlacements: Placement[] = [
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
        allPlacements.forEach((p) => {
            expect(getFallbackPlacements(p)).toHaveLength(11);
        });
    });
});
