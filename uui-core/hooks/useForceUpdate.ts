import { useState, useCallback } from 'react';

export const useForceUpdate = () => {
    const [, updateState] = useState<object>();
    return useCallback(() => updateState({}), []);
};
