import { isValueWithinRange } from "../virtualList";

describe('isValueWithinRange work correctly', () => {
    it('isValueWithinRange work correctly', () => {
        expect(isValueWithinRange(1, [2, 3])).toBeFalsy();
        expect(isValueWithinRange(2, [2, 5])).toBeTruthy();
        expect(isValueWithinRange(3, [2, 5])).toBeTruthy();
        expect(isValueWithinRange(2, [0, 0])).toBeFalsy();
    });
});