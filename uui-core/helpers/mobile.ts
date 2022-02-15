import { Modifier } from "react-popper";
import { isClientSide } from './ssr';

export const isMobile = () => {
    // return window.matchMedia?.("screen and (max-width: 720px)").matches;
    return isClientSide && window.screen?.width <= 720;
};

export const mobilePopperModifier: Modifier<any> = {
    name: 'computeStyles',
    options: {
        roundOffsets: ({ x, y }: { x: number, y: number }) => ({
            x: isMobile() ? 0 : x,
            y: isMobile() ? 0 : y,
        }),
    },
};