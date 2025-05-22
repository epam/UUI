export function mockGetBoundingClientRect(callback?: (elem: HTMLElement) => Partial<DOMRect>) {
    Object.assign(window.Element.prototype, {
        getBoundingClientRect: function mockForTest(this: HTMLElement) {
            const res = callback ? callback(this) as DOMRect : {} as DOMRect;
            const fallback: Partial<DOMRect> = {
                x: 0,
                y: 0,
                width: 1,
                height: 1,
                top: 0,
                left: 0,
                bottom: 1,
                right: 1,
            };
            return {
                ...fallback,
                ...res,
            };
        },
    });
}
