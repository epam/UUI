import React, { useState } from 'react';
import { Layout } from './components/layout/layout';
import { PaletteTable } from './components/paletteTable/paletteTable';
import { useCurrentTheme } from './hooks/useCurrentTheme';
import { TExpectedValueType } from './types/types';
import { useThemeTokens } from './hooks/useThemeTokens';

export function PalettePage() {
    const uuiTheme = useCurrentTheme();
    const [filter, setFilter] = useState<{ path: string }>({ path: 'core' });
    const [expectedValueType, setExpectedValueType] = useState<TExpectedValueType>(TExpectedValueType.chain);
    const result = useThemeTokens({ uuiTheme, expectedValueType, filter });
    const settings = {
        grouped: true,
        result,
        uuiTheme,
        expectedValueType,
        onChangeExpectedValueType: setExpectedValueType,
        filter,
        onChangeFilter: setFilter,
    };
    return (
        <Layout>
            <PaletteTable { ...settings } />
        </Layout>
    );
}
