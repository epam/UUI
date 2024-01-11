import React, { useState } from 'react';
import { Layout } from './components/layout/layout';
import { PaletteTable } from './components/paletteTable/paletteTable';
import { TLoadThemeTokensParams } from './types/types';
import { useThemeTokens } from './hooks/useThemeTokens/useThemeTokens';
import { DEFAULT_LOAD_PARAMS } from './constants';

export function PalettePage() {
    const [params, setParams] = useState<TLoadThemeTokensParams>(DEFAULT_LOAD_PARAMS);
    const result = useThemeTokens(params);

    const settings = {
        grouped: true,
        params,
        onChangeParams: setParams,
        result,
    };
    return (
        <Layout>
            <PaletteTable { ...settings } />
        </Layout>
    );
}
