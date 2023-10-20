import { BaseContext } from './BaseContext';
import maxBy from 'lodash.maxby';
import { isClientSide } from '../helpers/ssr';

export interface LayoutLayer {
    id: number;
    depth: number;
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

    /**
     * This method is needed for another UUI component: <PortalRoot />
     * Please don't use it for anything else.
     */
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

    public releaseLayer(layer: LayoutLayer) {
        this.layers = this.layers.filter((l) => l.id !== layer.id);
    }
}
