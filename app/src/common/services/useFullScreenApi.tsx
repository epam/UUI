import * as React from 'react';
import { useCallback, useEffect } from 'react';

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
    if (canClose && isSomeElementOpenedFullScreen()) {
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

const FULL_SCREEN_MODIFIER = 'full-screen';

export function useFullScreenApi(): IFullScreenApi {
    const [isFullScreen, setIsFullScreen] = React.useState<boolean>(() => isSomeElementOpenedFullScreen());

    useEffect(() => {
        return () => {
            closeFullScreen();
        };
    }, []);

    useEffect(() => {
        return onFullScreenChange(() => {
            const isFullScreenElementOpened = isSomeElementOpenedFullScreen();
            setIsFullScreen(isFullScreenElementOpened);
            if (isFullScreenElementOpened) {
                document.body.classList.add(FULL_SCREEN_MODIFIER);
            } else {
                document.body.classList.remove(FULL_SCREEN_MODIFIER);
            }
        });
    }, []);

    const handleOpenFullScreen = useCallback(async () => {
        await openElementFullScreen(document.body);
    }, []);

    return React.useMemo(
        () => ({
            isSupported: isFullScreenAllowed(),
            isFullScreen,
            openFullScreen: handleOpenFullScreen,
            closeFullScreen,
        }),
        [isFullScreen, handleOpenFullScreen],
    );
}
