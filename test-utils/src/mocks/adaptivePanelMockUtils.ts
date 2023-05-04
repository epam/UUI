import { mockGetBoundingClientRect } from '../internal/jsdomMockUtils';

const isAdaptivePanelRootDefault = (elem: HTMLElement) => {
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
    isAdaptivePanelRoot?: (element: HTMLElement) => boolean,
}) {
    const isAdaptivePanel = params.isAdaptivePanelRoot || isAdaptivePanelRootDefault;
    return mockGetBoundingClientRect((elem) => {
        if (isAdaptivePanel(elem)) {
            return { width: params.width };
        } else if (isAdaptivePanel(elem.parentElement.parentElement)) {
            return { width: params.itemWidth };
        }
    });
}
