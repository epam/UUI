export function mockGetBoundingClientRect(callback: (elem: HTMLElement) => Partial<DOMRect>) {
    Object.assign(window.Element.prototype, {
        getBoundingClientRect: function mockForTest(this: HTMLElement) {
            const res = callback(this) as DOMRect;
            const fallback: Partial<DOMRect> = {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
            };
            return {
                ...fallback,
                ...res,
            };
        },
    });
}
