/**
 * Name of the data attribute which is used by UUI lib to store IDs of any nested UUI Portal roots.
 */
const DATA_ATTR_FOR_PORTAL_ROOT_IDS = 'data-shadow-host-id';
const LIST_SEPARATOR = ',';

type PortalSearchRoot = Document | ShadowRoot;

function findPortalInMarkedShadowHosts(root: PortalSearchRoot, id: string): HTMLElement | null {
    const hosts = root.querySelectorAll(`[${DATA_ATTR_FOR_PORTAL_ROOT_IDS}*="${id}"]`);

    for (let i = 0; i < hosts.length; i++) {
        const host = hosts[i];
        const attr = host.getAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS);
        if (!attr || !attr.split(LIST_SEPARATOR).includes(id)) {
            continue;
        }

        const { shadowRoot } = host;
        if (!shadowRoot) {
            continue;
        }

        const direct = shadowRoot.getElementById(id);
        if (direct) {
            return direct;
        }

        const nested = findPortalInMarkedShadowHosts(shadowRoot, id);
        if (nested) {
            return nested;
        }
    }

    return null;
}

export function discoverPortalRootById(id: string): HTMLElement | null {
    const root = document.getElementById(id);
    if (root) {
        return root;
    }

    return findPortalInMarkedShadowHosts(document, id);
}
