/**
 * Name of the data attribute which is used by UUI lib to store IDs of any nested UUI Portal roots.
 */
const DATA_ATTR_FOR_PORTAL_ROOT_IDS = 'data-shadow-host-id';
const LIST_SEPARATOR = ',';

/**
 * Adds a marker to the shadow host which helps the LayoutContext
 * to find this portal root element if it's located under shadow DOM.
 *
 * @see uui-core/src/services/LayoutContextHelpers.ts
 *
 * @param node
 * @param id
 */
export function makePortalRootDiscoverable(node: HTMLElement, id: string): () => void {
    if (node) {
        const destructors: (() => void)[] = [];
        for (const sr of getAllParentShadowRoots(node)) {
            const host = sr.host;
            updateHostDataAttribute({ host, id, mode: 'add' });
            destructors.push(() => {
                updateHostDataAttribute({ host, id, mode: 'remove' });
            });
        }
        return () => {
            destructors.forEach((d) => {
                try {
                    d();
                } catch (err) {
                    console.error(err);
                }
            });
        };
    }
    return () => {};
}

function* getAllParentShadowRoots(node: HTMLElement) {
    let next = node.getRootNode();
    while (next instanceof ShadowRoot) {
        yield next;
        next = next.host.getRootNode();
    }
}

function updateHostDataAttribute(params: { host: Element, mode: 'add' | 'remove', id: string }) {
    const { host, id, mode } = params;
    const prev = host.getAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS);
    const ids = prev ? new Set(prev.split(LIST_SEPARATOR)) : new Set<string>();
    if (mode === 'add') {
        ids.add(id);
    } else if (mode === 'remove') {
        ids.delete(id);
    }
    const next = [...ids].join(LIST_SEPARATOR);
    if (next) {
        host.setAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS, next);
    } else {
        host.removeAttribute(DATA_ATTR_FOR_PORTAL_ROOT_IDS);
    }
}
