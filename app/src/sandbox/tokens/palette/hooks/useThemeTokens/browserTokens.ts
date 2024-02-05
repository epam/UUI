export function getBrowserTokens(): { getPropertyValue: (property: string) => string; } {
    return getComputedStyle(document.body);
}
