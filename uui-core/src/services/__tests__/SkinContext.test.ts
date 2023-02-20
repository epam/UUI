import { SkinContext } from '../SkinContext';

describe('SkinContext', () => {
    it('should set skin', () => {
        const skinMock = { test: 'Test' } as any;
        const context = new SkinContext();

        context.setSkin(skinMock);
        expect(context.skin).toBe(skinMock);
    });
});
