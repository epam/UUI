import { useCallback, useState } from "react";

export const useFilterPanelOptions = () => {
    const [isPanelOpened, setIsPanelOpened] = useState<boolean>(false);
    const [panelStyleModifier, setPanelStyleModifier] = useState<'show' | 'hide'>('hide');
    const [isButtonVisible, setIsButtonVisible] = useState<boolean>(true);

    const openPanel = useCallback(() => {
        setIsPanelOpened(true);
        setIsButtonVisible(false);
        setPanelStyleModifier('show');
    }, []);

    const closePanel = useCallback(() => {
        Promise.resolve()
            .then(() => setPanelStyleModifier('hide'))
            .then(() => setIsButtonVisible(true))
            .then(() => {
                setTimeout(() => setIsPanelOpened(false), 500);
            });
    }, []);
    
    return {
        isPanelOpened,
        panelStyleModifier,
        isButtonVisible,
        openPanel,
        closePanel,
    } as const;
};