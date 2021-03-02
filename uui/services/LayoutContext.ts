import { BaseContext } from './BaseContext';
import maxBy from 'lodash.maxby';
import { LayoutLayer } from '../types/objects';



export class LayoutContext extends BaseContext {
    layerIdCounter = 0;
    layers: LayoutLayer[] = [];

    public getLayer(): LayoutLayer {
        const topLayer = maxBy(this.layers, l => l.depth);
        const depth = topLayer ? topLayer.depth + 1 : 0;
        const layer = {
            id: this.layerIdCounter++,
            depth,
            zIndex: depth * 100 + 2000,
        };

        this.layers.push(layer);

        return layer;
    }

    public releaseLayer(layer: LayoutLayer) {
        this.layers = this.layers.filter(l => l.id != layer.id);
    }
}