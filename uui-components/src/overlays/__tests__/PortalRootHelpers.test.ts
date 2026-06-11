import { makePortalRootDiscoverable } from '../PortalRootHelpers';

const DATA_ATTR_FOR_PORTAL_ROOT_IDS = 'data-shadow-host-id';

describe('makePortalRootDiscoverable', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('returns noop cleanup when node is falsy', () => {
        const cleanup = makePortalRootDiscoverable(null as unknown as HTMLElement, 'portal-id');

        expect(cleanup).toEqual(expect.any(Function));
        expect(() => cleanup()).not.toThrow();
    });

    test('does not set attribute when node is not inside shadow DOM', () => {
        const node = document.createElement('div');
        document.body.appendChild(node);

        const cleanup = makePortalRootDiscoverable(node, 'portal-id');

        expect(document.body.getAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS)).toBeNull();
        cleanup();
    });

    test('sets portal id on shadow host when node is inside shadow DOM', () => {
        const host = document.createElement('div');
        const shadowRoot = host.attachShadow({ mode: 'open' });
        const node = document.createElement('div');
        shadowRoot.appendChild(node);
        document.body.appendChild(host);

        const cleanup = makePortalRootDiscoverable(node, 'portal-id');

        expect(host.getAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS)).toBe('portal-id');

        cleanup();

        expect(host.hasAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS)).toBe(false);
    });

    test('appends portal id to existing shadow host ids', () => {
        const host = document.createElement('div');
        host.setAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS, 'existing-id');
        const shadowRoot = host.attachShadow({ mode: 'open' });
        const node = document.createElement('div');
        shadowRoot.appendChild(node);
        document.body.appendChild(host);

        const cleanup = makePortalRootDiscoverable(node, 'portal-id');

        expect(host.getAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS)).toBe('existing-id,portal-id');

        cleanup();

        expect(host.getAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS)).toBe('existing-id');
    });

    test('sets portal id on all nested shadow hosts', () => {
        const outerHost = document.createElement('div');
        const outerShadow = outerHost.attachShadow({ mode: 'open' });
        const innerHost = document.createElement('div');
        outerShadow.appendChild(innerHost);
        const innerShadow = innerHost.attachShadow({ mode: 'open' });
        const node = document.createElement('div');
        innerShadow.appendChild(node);
        document.body.appendChild(outerHost);

        const cleanup = makePortalRootDiscoverable(node, 'portal-id');

        expect(outerHost.getAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS)).toBe('portal-id');
        expect(innerHost.getAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS)).toBe('portal-id');

        cleanup();

        expect(outerHost.hasAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS)).toBe(false);
        expect(innerHost.hasAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS)).toBe(false);
    });

    test('logs errors thrown during cleanup without rethrowing', () => {
        const host = document.createElement('div');
        const shadowRoot = host.attachShadow({ mode: 'open' });
        const node = document.createElement('div');
        shadowRoot.appendChild(node);
        document.body.appendChild(host);

        const cleanup = makePortalRootDiscoverable(node, 'portal-id');
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        jest.spyOn(host, 'removeAttribute').mockImplementation(() => {
            throw new Error('cleanup failed');
        });

        expect(() => cleanup()).not.toThrow();
        expect(consoleErrorSpy).toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
        jest.restoreAllMocks();
    });
});
