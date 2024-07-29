import { useEffect } from 'react';
import { PlayWrightInterfaceName } from '../constants';

export function usePlayWrightInterface<T extends object>(setter: (newParams: T) => void) {
    useEffect(() => {
        (window as any)[PlayWrightInterfaceName] = (_params: string) => {
            setter(JSON.parse(_params) as T);
        };
        return () => {
            delete (window as any)[PlayWrightInterfaceName];
        };
    }, [setter]);
}
