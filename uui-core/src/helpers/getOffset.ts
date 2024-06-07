export function getOffset(element: Element) {
    const box = element.getBoundingClientRect();

    return {
        top: box.top + window.scrollY - document.documentElement.clientTop,
        left: box.left + window.scrollX - document.documentElement.clientLeft,
    };
}
