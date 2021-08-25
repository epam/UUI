import { Modifier } from "react-popper";

export const isMobile = () => window.matchMedia ? window.matchMedia("screen and (max-width: 720px)").matches : undefined;

export const mobilePopperModifier: Modifier<any> = {
    name: 'computeStyles',
    options: {
        roundOffsets: ({ x, y }: { x: number, y: number }) => ({
            x: isMobile() ? 0 : x,
            y: isMobile() ? 0 : y,
        }),
    },
};