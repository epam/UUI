import { isClientSide } from './ssr';

export const screenSize = {
    width: 0,
    height: 0,
};

if (isClientSide) {
    screenSize.width = window.innerWidth;
    screenSize.height = window.innerHeight;

    window.addEventListener('resize', () => {
        screenSize.width = window.innerWidth;
        screenSize.height = window.innerHeight;
    });
}
