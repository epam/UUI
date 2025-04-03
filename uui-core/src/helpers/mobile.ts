import { Middleware } from '@floating-ui/react';
import { isClientSide } from './ssr';

export const isMobile = (screenWidth: number = 720) => {
    return isClientSide && window.matchMedia?.(`screen and (max-width: ${screenWidth}px)`).matches;
};

export const mobilePositioning: Middleware = {
    name: 'mobilePositioning',
    fn({ x, y }) {
        return {
            x: isMobile() ? 0 : x,
            y: isMobile() ? 0 : y,
        };
    },
};
