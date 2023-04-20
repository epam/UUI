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
});
