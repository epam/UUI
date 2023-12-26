import React, { useState } from 'react';
import { Layout } from './components/layout/layout';
import { PaletteTable } from './components/paletteTable/paletteTable';
import { useCurrentTheme } from './hooks/useCurrentTheme';
import { TExpectedValueType } from './types/types';
import { useThemeTokens } from './hooks/useThemeTokens';
import { Spinner } from '@epam/uui';

export function PalettePage() {
    const uuiThemeRequested = useCurrentTheme();
    const [expectedValueType, setExpectedValueType] = useState<TExpectedValueType>(TExpectedValueType.chain);
    const result = useThemeTokens({ uuiThemeRequested, expectedValueType });
    if (!result) {
        return (
            <Layout>
                <Spinner />
            </Layout>
        );
    }
    const settings = {
        tokens: result.tokens,
        uuiTheme: result.theme,
        expectedValueType,
        onChangeExpectedValueType: setExpectedValueType,
    };
    return (
        <Layout>
            <PaletteTable { ...settings } />
        </Layout>
    );
}
