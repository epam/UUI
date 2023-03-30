import { shouldCreateUndoCheckpoint } from '../shouldCreateUndoCheckpoint';

describe('shouldCreateUndoCheckpoint', () => {
    it('scalar change', () => {
        // The field is changed again. No need to checkpoint - we already created it previously
        expect(shouldCreateUndoCheckpoint('a', 'aa', 'aaa')).toBe(false);
    });

    it('scalar change from null', () => {
        // undo should return directly to null, skipping 'a'
        expect(shouldCreateUndoCheckpoint(null, 'a', 'aa')).toBe(false);
    });

    it('same field change', () => {
        // undo should return to 'a', skipping 'ab'
        expect(shouldCreateUndoCheckpoint(
            { name: 'a' },
            { name: 'ab' },
            { name: 'abc' },
        )).toBe(false);
    });

    it('object created', () => {
        expect(shouldCreateUndoCheckpoint(
            null,
            null,
            { name: 'a'  },
        )).toBe(true);
    });

    it('object created and then field updated', () => {
        expect(shouldCreateUndoCheckpoint(
            null,
            { name: 'a' },
            { name: 'b' },
        )).toBe(false);
    });

    it('object created and then is not changed', () => {
        expect(shouldCreateUndoCheckpoint(
            null,
            { name: 'a' },
            { name: 'a' },
        )).toBe(false);
    });

    it('new field added', () => {
        expect(shouldCreateUndoCheckpoint(
            { name: 'a' },
            { name: 'b' },
            { name: 'b', title: 'a' },
        )).toBe(true);
    });

    it('same field changed', () => {
        expect(shouldCreateUndoCheckpoint(
            { name: 'a', title: 'a' },
            { name: 'a', title: 'b' },
            { name: 'a', title: 'c' },
        )).toBe(false);
    });

    it('different field changed', () => {
        expect(shouldCreateUndoCheckpoint(
            { name: 'a', title: 'a' },
            { name: 'b', title: 'a' },
            { name: 'b', title: 'b' },
        )).toBe(true);
    });

    it('Field is removed', () => {
        expect(shouldCreateUndoCheckpoint(
            { name: 'a', title: 'a' },
            { name: 'b', title: 'a' },
            { name: 'b' },
        )).toBe(true);
    });

    it('new item added to array', () => {
        expect(shouldCreateUndoCheckpoint(
            [],
            [],
            [1],
        )).toBe(true);
    });

    it('new item added and then edited', () => {
        expect(shouldCreateUndoCheckpoint(
            [],
            [1],
            [2],
        )).toBe(false);
    });

})