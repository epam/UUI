import { BaseContext } from './BaseContext';
import { isClientSide } from '../helpers/ssr';

export interface LayoutLayer {
    /** ID of the layer */
    id: number;
    /** Level of the layer depth */
    depth: number;
    /** zIndex of the layer */
    zIndex: number;
}
function genUniqueId() {
    return [Math.random(), Math.random()].reduce((acc, n) => (acc + n.toString(36).substring(2)), '');
}

function getPortalRootById(id: string) {
    let root = document.getElementById(id);
    if (!root) {
        /*
         * document.getElementById doesn't find elements by ID if they are located in shadow DOM.
         * so, as a fallback, we try to find shadow host by attribute name like this: [data-<id>]
         * and after that - try to find by id in the shadow root.
         */
        const shadow = document.querySelector(`[data-shadow-host-id="${id}"]`);
        root = shadow?.shadowRoot?.getElementById(id);
    }
    return root;
}

function maxBy<T>(arr: T[], getMax: (item: T) => number) {
    let maxItem: T;
    arr.forEach((value) => {
        if (maxItem === undefined) {
            maxItem = value;
        }

        if (getMax(value) > getMax(maxItem)) {
            maxItem = value;
        }
    });

    return maxItem;
}

export class LayoutContext extends BaseContext {
    layerIdCounter = 0;
    layers: LayoutLayer[] = [];

    private readonly portalRootId: string = genUniqueId();

    public getPortalRoot() {
        /**
         * TODO: we should remove this part: document.getElementById('main') || document.getElementById('root')
         */
        if (isClientSide) {
            return getPortalRootById(this.portalRootId) || document.getElementById('main') || document.getElementById('root') || document.body;
        }
    }

    public getPortalRootId() {
        return this.portalRootId;
    }

    public getLayer(): LayoutLayer {
        const topLayer = maxBy(this.layers, (l) => l.depth);
        const depth = topLayer ? topLayer.depth + 1 : 0;
        const layer = {
            id: this.layerIdCounter++,
            depth,
            zIndex: depth * 100 + 2000,
        };

        this.layers.push(layer);

        return layer;
    }

    public releaseLayer(layer: LayoutLayer | number) {
        let id: number;
        if (typeof layer === 'number') {
            id = layer;
        } else {
            id = layer.id;
        }
        this.layers = this.layers.filter((l) => l.id !== id);
    }
}
