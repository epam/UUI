import {
    getPortalRootById,
    markPortalRootInShadowChain,
    NESTED_SHADOW_PORTAL_ROOT_IDS_ATTR,
    SHADOW_HOST_PORTAL_ROOT_ID_ATTR,
} from '../portalRootDiscovery';
import { LayoutContext } from '../../services/LayoutContext';

type ShadowChain = {
    hosts: HTMLElement[];
    portalRoot: HTMLElement;
    cleanup: () => void;
};

/** Builds a shadow chain of `depth` levels (1 = single shadow, 2 = double, etc.) with portal root at `portalRootDepth`. */
function createShadowChain(portalRootId: string, depth: number, portalRootDepth = depth): ShadowChain {
    const hosts: HTMLElement[] = [];
    let parent: HTMLElement | ShadowRoot = document.body;

    for (let level = 0; level < depth; level += 1) {
        const host = document.createElement('div');
        host.id = `shadow-host-level-${level}`;
        if (parent === document.body) {
            document.body.appendChild(host);
        } else {
            (parent as ShadowRoot).appendChild(host);
        }
        hosts.push(host);
        parent = host.attachShadow({ mode: 'open' });
    }

    const portalRoot = document.createElement('div');
    portalRoot.id = portalRootId;

    if (portalRootDepth === 0) {
        document.body.appendChild(portalRoot);
    } else {
        const targetHost = hosts[portalRootDepth - 1];
        targetHost.shadowRoot!.appendChild(portalRoot);
    }

    return {
        hosts,
        portalRoot,
        cleanup: () => {
            document.body.innerHTML = '';
        },
    };
}

describe('portalRootDiscovery', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should find portal root in light DOM without shadow markers', () => {
        const portalRootId = 'light-dom-portal-root';
        const portalRoot = document.createElement('div');
        portalRoot.id = portalRootId;
        document.body.appendChild(portalRoot);

        const unmark = markPortalRootInShadowChain(portalRoot, portalRootId);

        expect(getPortalRootById(portalRootId)).toBe(portalRoot);

        unmark();
        expect(getPortalRootById(portalRootId)).toBe(portalRoot);
    });

    it('should find portal root in a single shadow DOM level', () => {
        const portalRootId = 'single-shadow-portal-root';
        const { hosts, portalRoot, cleanup } = createShadowChain(portalRootId, 1);

        const unmark = markPortalRootInShadowChain(portalRoot, portalRootId);

        expect(hosts[0].getAttribute(SHADOW_HOST_PORTAL_ROOT_ID_ATTR)).toBe(portalRootId);
        expect(hosts[0].getAttribute(NESTED_SHADOW_PORTAL_ROOT_IDS_ATTR)).toBeNull();
        expect(getPortalRootById(portalRootId)).toBe(portalRoot);

        unmark();
        cleanup();
        expect(getPortalRootById(portalRootId)).toBeNull();
    });

    it('should find portal root inside nested shadow DOM via ancestor markers', () => {
        const portalRootId = 'nested-portal-root-id';
        const { hosts, portalRoot, cleanup } = createShadowChain(portalRootId, 2);

        const unmark = markPortalRootInShadowChain(portalRoot, portalRootId);

        expect(hosts[1].getAttribute(SHADOW_HOST_PORTAL_ROOT_ID_ATTR)).toBe(portalRootId);
        expect(hosts[0].getAttribute(NESTED_SHADOW_PORTAL_ROOT_IDS_ATTR)).toBe(portalRootId);
        expect(getPortalRootById(portalRootId)).toBe(portalRoot);

        unmark();
        cleanup();
        expect(getPortalRootById(portalRootId)).toBeNull();
    });

    it('should find portal root inside triple-nested shadow DOM', () => {
        const portalRootId = 'triple-shadow-portal-root';
        const { hosts, portalRoot, cleanup } = createShadowChain(portalRootId, 3);

        const unmark = markPortalRootInShadowChain(portalRoot, portalRootId);

        expect(hosts[2].getAttribute(SHADOW_HOST_PORTAL_ROOT_ID_ATTR)).toBe(portalRootId);
        expect(hosts[1].getAttribute(NESTED_SHADOW_PORTAL_ROOT_IDS_ATTR)).toBe(portalRootId);
        expect(hosts[0].getAttribute(NESTED_SHADOW_PORTAL_ROOT_IDS_ATTR)).toBe(portalRootId);
        expect(getPortalRootById(portalRootId)).toBe(portalRoot);

        unmark();
        cleanup();
        expect(getPortalRootById(portalRootId)).toBeNull();
    });

    it('should find portal root when mounted in outer shadow, not innermost', () => {
        const portalRootId = 'outer-shadow-portal-root';
        const { hosts, portalRoot, cleanup } = createShadowChain(portalRootId, 2, 1);

        const unmark = markPortalRootInShadowChain(portalRoot, portalRootId);

        expect(hosts[0].getAttribute(SHADOW_HOST_PORTAL_ROOT_ID_ATTR)).toBe(portalRootId);
        expect(hosts[1].getAttribute(SHADOW_HOST_PORTAL_ROOT_ID_ATTR)).toBeNull();
        expect(getPortalRootById(portalRootId)).toBe(portalRoot);

        unmark();
        cleanup();
        expect(getPortalRootById(portalRootId)).toBeNull();
    });

    it('should resolve via DOM fallback at any shadow depth when registration is unavailable', () => {
        const cases = [
            { depth: 1, portalRootDepth: 1, id: 'fallback-depth-1' },
            { depth: 2, portalRootDepth: 2, id: 'fallback-depth-2' },
            { depth: 3, portalRootDepth: 3, id: 'fallback-depth-3' },
            { depth: 2, portalRootDepth: 1, id: 'fallback-outer-level' },
        ];

        cases.forEach(({ depth, portalRootDepth, id }) => {
            const { portalRoot, cleanup } = createShadowChain(id, depth, portalRootDepth);
            const unmark = markPortalRootInShadowChain(portalRoot, id);

            const context = new LayoutContext();
            expect(context.getPortalRootId()).not.toBe(id);
            expect(getPortalRootById(id)).toBe(portalRoot);

            unmark();
            cleanup();
        });
    });

    it('should keep separate portal roots for multiple widgets via comma-separated ancestor ids', () => {
        const idA = 'widget-a-portal';
        const idB = 'widget-b-portal';

        const chainA = createShadowChain(idA, 2);
        const chainB = createShadowChain(idB, 2);

        const unmarkA = markPortalRootInShadowChain(chainA.portalRoot, idA);
        const unmarkB = markPortalRootInShadowChain(chainB.portalRoot, idB);

        expect(getPortalRootById(idA)).toBe(chainA.portalRoot);
        expect(getPortalRootById(idB)).toBe(chainB.portalRoot);

        unmarkA();
        unmarkB();
        chainA.cleanup();
        chainB.cleanup();
    });
});

describe('LayoutContext portal root registration', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should prefer registered portal root over DOM lookup fallback', () => {
        const context = new LayoutContext();
        const portalRootId = context.getPortalRootId();
        const registeredRoot = document.createElement('div');
        registeredRoot.id = portalRootId;
        document.body.appendChild(registeredRoot);

        const fallbackRoot = document.createElement('div');
        fallbackRoot.id = 'main';
        document.body.appendChild(fallbackRoot);

        context.registerPortalRoot(registeredRoot);
        expect(context.getPortalRoot()).toBe(registeredRoot);

        registeredRoot.remove();
        expect(context.getPortalRoot()).toBe(fallbackRoot);
    });

    it('should use registered portal root inside nested shadow regardless of depth', () => {
        const context = new LayoutContext();
        const portalRootId = context.getPortalRootId();
        const { portalRoot, cleanup } = createShadowChain(portalRootId, 3);

        context.registerPortalRoot(portalRoot);
        expect(context.getPortalRoot()).toBe(portalRoot);

        cleanup();
        expect(context.getPortalRoot()).not.toBe(portalRoot);
    });
});
