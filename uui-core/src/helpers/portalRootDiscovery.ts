export const SHADOW_HOST_PORTAL_ROOT_ID_ATTR = 'data-shadow-host-id';
export const NESTED_SHADOW_PORTAL_ROOT_IDS_ATTR = 'data-shadow-portal-root-ids';

function parseNestedPortalRootIds(value: string | null): string[] {
    if (!value) {
        return [];
    }
    return value.split(',').filter(Boolean);
}

function addNestedPortalRootId(host: HTMLElement, id: string) {
    const ids = parseNestedPortalRootIds(host.getAttribute(NESTED_SHADOW_PORTAL_ROOT_IDS_ATTR));
    if (!ids.includes(id)) {
        ids.push(id);
        host.setAttribute(NESTED_SHADOW_PORTAL_ROOT_IDS_ATTR, ids.join(','));
    }
}

function removeNestedPortalRootId(host: HTMLElement, id: string) {
    const ids = parseNestedPortalRootIds(host.getAttribute(NESTED_SHADOW_PORTAL_ROOT_IDS_ATTR)).filter((item) => item !== id);
    if (ids.length) {
        host.setAttribute(NESTED_SHADOW_PORTAL_ROOT_IDS_ATTR, ids.join(','));
    } else {
        host.removeAttribute(NESTED_SHADOW_PORTAL_ROOT_IDS_ATTR);
    }
}

/**
 * Marks shadow hosts along the portal root's ancestor chain so LayoutContext can resolve
 * portal roots inside nested shadow DOM without scanning the whole document.
 */
export function markPortalRootInShadowChain(node: HTMLElement, id: string): () => void {
    const cleanups: Array<() => void> = [];
    let root: Node = node.getRootNode();
    let isDirectHost = true;

    while (root instanceof ShadowRoot) {
        const hostElem = root.host as HTMLElement;

        if (isDirectHost) {
            hostElem.setAttribute(SHADOW_HOST_PORTAL_ROOT_ID_ATTR, id);
            cleanups.push(() => hostElem.removeAttribute(SHADOW_HOST_PORTAL_ROOT_ID_ATTR));
            isDirectHost = false;
        } else {
            addNestedPortalRootId(hostElem, id);
            cleanups.push(() => removeNestedPortalRootId(hostElem, id));
        }

        root = hostElem.getRootNode();
    }

    return () => {
        cleanups.forEach((cleanup) => cleanup());
    };
}

function findPortalRootInShadowTree(shadowRoot: ShadowRoot, id: string): HTMLElement | null {
    const directMatch = shadowRoot.getElementById(id);
    if (directMatch) {
        return directMatch;
    }

    const nestedHosts = shadowRoot.querySelectorAll(
        `[${SHADOW_HOST_PORTAL_ROOT_ID_ATTR}="${id}"], [${NESTED_SHADOW_PORTAL_ROOT_IDS_ATTR}]`,
    );

    for (const host of Array.from(nestedHosts)) {
        if (!(host instanceof HTMLElement) || !host.shadowRoot) {
            continue;
        }

        const isDirectNestedHost = host.getAttribute(SHADOW_HOST_PORTAL_ROOT_ID_ATTR) === id;
        const isRegisteredAncestor = parseNestedPortalRootIds(
            host.getAttribute(NESTED_SHADOW_PORTAL_ROOT_IDS_ATTR),
        ).includes(id);

        if (!isDirectNestedHost && !isRegisteredAncestor) {
            continue;
        }

        const nestedMatch = findPortalRootInShadowTree(host.shadowRoot, id);
        if (nestedMatch) {
            return nestedMatch;
        }
    }

    return null;
}

export function getPortalRootById(id: string): HTMLElement | null {
    const directMatch = document.getElementById(id);
    if (directMatch) {
        return directMatch;
    }

    const directHost = document.querySelector(`[${SHADOW_HOST_PORTAL_ROOT_ID_ATTR}="${id}"]`);
    if (directHost instanceof HTMLElement && directHost.shadowRoot) {
        const inDirectHost = findPortalRootInShadowTree(directHost.shadowRoot, id);
        if (inDirectHost) {
            return inDirectHost;
        }
    }

    const ancestorHosts = document.querySelectorAll(`[${NESTED_SHADOW_PORTAL_ROOT_IDS_ATTR}]`);
    for (const host of Array.from(ancestorHosts)) {
        if (!(host instanceof HTMLElement) || !host.shadowRoot) {
            continue;
        }

        if (!parseNestedPortalRootIds(host.getAttribute(NESTED_SHADOW_PORTAL_ROOT_IDS_ATTR)).includes(id)) {
            continue;
        }

        const nestedMatch = findPortalRootInShadowTree(host.shadowRoot, id);
        if (nestedMatch) {
            return nestedMatch;
        }
    }

    return null;
}
