import { useEffect } from 'react';
import { TPreviewContentParams } from '../types';
import { PlayWrightInterfaceName } from '../constants';

export function usePlayWrightInterface(setter: (newParams: TPreviewContentParams) => void) {
    useEffect(() => {
        (window as any)[PlayWrightInterfaceName] = (_params: string) => {
            setter(JSON.parse(_params) as TPreviewContentParams);
        };
        return () => {
            delete (window as any)[PlayWrightInterfaceName];
        };
    }, [setter]);
}
