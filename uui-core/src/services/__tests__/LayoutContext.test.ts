import { LayoutContext } from '../LayoutContext';

describe('LayoutContext', () => {
    it('should work correctly', () => {
        const context = new LayoutContext();

        const layer1 = context.getLayer();
        const layer2 = context.getLayer();
        const layer3 = context.getLayer();
        expect(context.layers.length).toBe(3);
        expect(layer1).toEqual({ id: 0, depth: 0, zIndex: 2000 });
        expect(layer2).toEqual({ id: 1, depth: 1, zIndex: 2100 });
        expect(layer3).toEqual({ id: 2, depth: 2, zIndex: 2200 });

        context.releaseLayer(layer2);
        expect(context.layers.length).toBe(2);

        context.releaseLayer(layer1);
        expect(context.layers.length).toBe(1);
    });

    describe('getTopOverlayZIndex', () => {
        it('returns legacy default when there are no layers', () => {
            const context = new LayoutContext();
            expect(context.getTopOverlayZIndex()).toBe(100500);
        });

        it('returns legacy default when max layer z-index is below legacy floor', () => {
            const context = new LayoutContext();
            context.getLayer(); // zIndex 2000
            expect(context.getTopOverlayZIndex()).toBe(100500);
        });

        it('returns max z-index + 1 when above legacy floor', () => {
            const context = new LayoutContext();
            for (let i = 0; i < 986; i++) {
                context.getLayer();
            }
            const top = context.layers[context.layers.length - 1];
            expect(top.zIndex).toBeGreaterThanOrEqual(100500);
            expect(context.getTopOverlayZIndex()).toBe(top.zIndex + 1);
        });
    });
});
