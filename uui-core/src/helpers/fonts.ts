import { isClientSide } from './ssr';

const fontAvailabilityCache = new Map<string, Promise<boolean>>();

/** Checks whether a font is loaded and available for use, caching the result per font so repeat calls are free. */
export function isFontAvailable(font: string): Promise<boolean> {
    if (!fontAvailabilityCache.has(font)) {
        const promise = isClientSide && document.fonts
            ? document.fonts.ready.then(() => document.fonts.check(font)).catch(() => false)
            : Promise.resolve(true);
        fontAvailabilityCache.set(font, promise);
    }
    return fontAvailabilityCache.get(font)!;
}
