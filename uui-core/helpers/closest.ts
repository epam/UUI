export function closest(element: HTMLElement, selector: string | HTMLElement): HTMLElement | null {
    if (!element || !selector) {
        return null;
    }
    if (typeof selector === 'string') {
        return element.closest && element.closest(selector);
    } else {
        let curElement: HTMLElement = element;
        while (curElement.parentElement) {
            if ([selector].indexOf(curElement) > -1) {
                return curElement;
            }
            curElement = curElement.parentElement;
        }

        return null;
    }
}