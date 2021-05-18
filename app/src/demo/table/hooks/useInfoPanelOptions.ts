import { useCallback, useState } from "react";

export const useInfoPanelOptions = () => {
    const [panelId, setPanelId] = useState<number | null>(null);
    const [isPanelOpened, setPanelOpened] = useState<boolean>(false);

    const openPanel = useCallback((id) => {
        setPanelId(id);
        setPanelOpened(true);
    }, []);

    const closePanel = useCallback(() => {
        Promise.resolve(false)
            .then(value => setPanelOpened(value))
            .then(() => {
                setTimeout(() => setPanelId(null), 500);
            });
    }, []);

    return { panelId, isPanelOpened, openPanel, closePanel } as const;
};