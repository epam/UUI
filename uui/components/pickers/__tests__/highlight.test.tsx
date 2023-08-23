import { getHighlightRanges } from '../highlight';

describe('getHighlightRanges', () => {
    it('should return no ranges, if no search matches were found', () => {
        expect(getHighlightRanges('some string', '.')).toEqual([]);
    });
    
    it('should return ranges of found search matches and not matched tokens', () => {
        expect(getHighlightRanges('some string', 'so str')).toEqual([
            { from: 0, to: 2, isHighlighted: true },
            { from: 2, to: 5, isHighlighted: false },
            { from: 5, to: 8, isHighlighted: true },
            { from: 8, to: 11, isHighlighted: false },            
        ]);
    });

    it('should return merged ranges', () => {
        expect(getHighlightRanges('merged ranges of found search string', 'rge ged ange ge es')).toEqual([
            { from: 0, to: 2, isHighlighted: false },
            { from: 2, to: 6, isHighlighted: true },
            { from: 6, to: 8, isHighlighted: false },
            { from: 8, to: 13, isHighlighted: true },
            { from: 13, to: 36, isHighlighted: false },
        ]);
    });
    
    it('should treat special chars as part of the string, not as regexp special chars', () => {
        expect(getHighlightRanges('merged? yes.', '? y .')).toEqual([
            { from: 0, to: 6, isHighlighted: false },
            { from: 6, to: 7, isHighlighted: true },
            { from: 7, to: 8, isHighlighted: false },
            { from: 8, to: 9, isHighlighted: true },
            { from: 9, to: 11, isHighlighted: false },
            { from: 11, to: 12, isHighlighted: true },
        ]);
    });
});
