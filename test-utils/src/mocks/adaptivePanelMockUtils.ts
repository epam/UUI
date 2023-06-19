import { mockGetBoundingClientRect } from '../internal/jsdomMockUtils';

const isAdaptivePanelRootDefault = (elem: HTMLElement | null) => {
    if (!elem) {
        return false;
    }
    return elem.getAttribute('data-testid') === 'adaptive-panel';
};

/**
 * By default, it relies on presence of data-testid="adaptive-panel" on the root adaptive panel element.
 * Please pass it as following:
 * ```
 * <AdaptivePanel { ...props } rawProps={ { 'data-testid': 'adaptive-panel'} } />
 * ```
 *
 * As an alternative, you can pass "isAdaptivePanelRoot" callback,
 * which should return true if given element is an adaptive panel root element.
 *
 * @param params
 */
export function mockAdaptivePanelLayout(params: {
    width: number,
    itemWidth: number,
    isAdaptivePanelRoot?: (element: HTMLElement | null) => boolean,
}) {
    const isAdaptivePanel = params.isAdaptivePanelRoot || isAdaptivePanelRootDefault;
    mockGetBoundingClientRect((elem: HTMLElement) => {
        if (isAdaptivePanel(elem)) {
            return typeof params.width !== 'undefined' ? { width: params.width } : {};
        } else if (isAdaptivePanel(elem.parentElement ? elem.parentElement.parentElement : null)) {
            return typeof params.width !== 'undefined' ? { width: params.itemWidth } : {};
        }
        return {};
    });
}
