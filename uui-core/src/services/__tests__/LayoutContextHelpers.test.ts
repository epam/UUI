import { discoverPortalRootById } from '../LayoutContextHelpers';

const DATA_ATTR_FOR_PORTAL_ROOT_IDS = 'data-shadow-host-id';

describe('discoverPortalRootById', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('returns element when found in document by id', () => {
        const portalRoot = document.createElement('div');
        portalRoot.id = 'portal-id';
        document.body.appendChild(portalRoot);

        expect(discoverPortalRootById('portal-id')).toBe(portalRoot);
    });

    test('returns null when element is not found', () => {
        expect(discoverPortalRootById('missing-id')).toBeNull();
    });

    test('returns element from shadow DOM when shadow host is marked with portal id', () => {
        const host = document.createElement('div');
        host.setAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS, 'portal-id');
        const shadowRoot = host.attachShadow({ mode: 'open' });
        const portalRoot = document.createElement('div');
        portalRoot.id = 'portal-id';
        shadowRoot.appendChild(portalRoot);
        document.body.appendChild(host);

        expect(discoverPortalRootById('portal-id')).toBe(portalRoot);
    });

    test('returns element from shadow DOM when portal id is among multiple host ids', () => {
        const host = document.createElement('div');
        host.setAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS, 'other-id,portal-id,another-id');
        const shadowRoot = host.attachShadow({ mode: 'open' });
        const portalRoot = document.createElement('div');
        portalRoot.id = 'portal-id';
        shadowRoot.appendChild(portalRoot);
        document.body.appendChild(host);

        expect(discoverPortalRootById('portal-id')).toBe(portalRoot);
    });

    test('does not match portal id by substring in shadow host attribute', () => {
        const host = document.createElement('div');
        host.setAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS, 'portal-id-extended');
        const shadowRoot = host.attachShadow({ mode: 'open' });
        const portalRoot = document.createElement('div');
        portalRoot.id = 'portal-id';
        shadowRoot.appendChild(portalRoot);
        document.body.appendChild(host);

        expect(discoverPortalRootById('portal-id')).toBeNull();
    });

    test('returns null when shadow host is marked but portal root is missing in shadow DOM', () => {
        const host = document.createElement('div');
        host.setAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS, 'portal-id');
        host.attachShadow({ mode: 'open' });
        document.body.appendChild(host);

        expect(discoverPortalRootById('portal-id')).toBeNull();
    });

    test('returns element from nested shadow DOM when shadow hosts are marked', () => {
        const outerHost = document.createElement('div');
        outerHost.setAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS, 'portal-id');
        const outerShadow = outerHost.attachShadow({ mode: 'open' });
        const innerHost = document.createElement('div');
        innerHost.setAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS, 'portal-id');
        outerShadow.appendChild(innerHost);
        const innerShadow = innerHost.attachShadow({ mode: 'open' });
        const portalRoot = document.createElement('div');
        portalRoot.id = 'portal-id';
        innerShadow.appendChild(portalRoot);
        document.body.appendChild(outerHost);

        expect(discoverPortalRootById('portal-id')).toBe(portalRoot);
    });

    test('skips marked shadow host without portal and checks next host', () => {
        const hostWithoutPortal = document.createElement('div');
        hostWithoutPortal.setAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS, 'portal-id');
        hostWithoutPortal.attachShadow({ mode: 'open' });
        document.body.appendChild(hostWithoutPortal);

        const hostWithPortal = document.createElement('div');
        hostWithPortal.setAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS, 'portal-id');
        const shadowRoot = hostWithPortal.attachShadow({ mode: 'open' });
        const portalRoot = document.createElement('div');
        portalRoot.id = 'portal-id';
        shadowRoot.appendChild(portalRoot);
        document.body.appendChild(hostWithPortal);

        expect(discoverPortalRootById('portal-id')).toBe(portalRoot);
    });

    test('prefers document element over shadow DOM lookup', () => {
        const documentPortalRoot = document.createElement('div');
        documentPortalRoot.id = 'portal-id';
        document.body.appendChild(documentPortalRoot);

        const host = document.createElement('div');
        host.setAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS, 'portal-id');
        const shadowRoot = host.attachShadow({ mode: 'open' });
        const shadowPortalRoot = document.createElement('div');
        shadowPortalRoot.id = 'portal-id';
        shadowRoot.appendChild(shadowPortalRoot);
        document.body.appendChild(host);

        expect(discoverPortalRootById('portal-id')).toBe(documentPortalRoot);
    });
});
