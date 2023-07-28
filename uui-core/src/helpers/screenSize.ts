import { isClientSide } from './ssr';

export function getScreenSize() {
    return {
        width: isClientSide ? window.innerWidth : 0,
        height: isClientSide ? window.innerHeight : 0,
    };
}
