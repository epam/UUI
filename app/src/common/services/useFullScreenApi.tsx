import * as React from "react";
import { useEffect } from "react";

function isFullScreenAllowed() {
    return Boolean(document.fullscreenEnabled);
}

function isSomeElementOpenedFullScreen() {
    return Boolean(document.fullscreenElement);
}

async function openElementFullScreen(element: HTMLElement) {
    const canOpen = isFullScreenAllowed() && element.requestFullscreen;
    if (canOpen) {
        await element.requestFullscreen();
    }
}

async function closeFullScreen() {
    const canClose = isFullScreenAllowed();
    if (canClose) {
        await document.exitFullscreen();
    }
}

function onFullScreenChange(listener: () => void) {
    document.addEventListener('fullscreenchange', listener);

    return () => {
        document.removeEventListener('fullscreenchange', listener);
    };
}

export interface IFullScreenApi {
    isSupported: boolean;
    isFullScreen: boolean;
    openFullScreen: () => void;
    closeFullScreen: () => void;
}

export function useFullScreenApi(ref: React.RefObject<HTMLElement>): IFullScreenApi {
    const [isFullScreen, setIsFullScreen] = React.useState<boolean>(() => isSomeElementOpenedFullScreen());

    useEffect(() => {
        return onFullScreenChange(() => {
            setIsFullScreen(isSomeElementOpenedFullScreen());
        });
    }, []);

    useEffect(() => {
        return () => {
            closeFullScreen();
        };
    }, []);

    const openFullScreen = React.useCallback(async () => {
        await openElementFullScreen(ref.current);
    }, [ref.current]);

    return React.useMemo(() => ({
        isSupported: isFullScreenAllowed(),
        isFullScreen,
        openFullScreen,
        closeFullScreen,
    }), [isFullScreen, openFullScreen]);
}
