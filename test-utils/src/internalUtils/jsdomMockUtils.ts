export function mockGetBoundingClientRect(callback: (elem: HTMLElement) => Partial<DOMRect>) {
    return jest.spyOn(window.Element.prototype, 'getBoundingClientRect').mockImplementation(
        function mockForTest(this: HTMLElement) {
            const res = callback(this) as DOMRect;
            return {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                ...res,
            };
        },
    );
}
