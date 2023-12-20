import { IThemeVar, TFigmaThemeName, THexaValue, TVarType } from '../../types/sharedTypes';
import { getCurrentTheme } from '../../../../../helpers';
import { TTheme } from '../../../../../common/docs/docsConstants';
import React from 'react';
import { IconContainer } from '@epam/uui';
import { ColorRectangle } from '../colorRectangle/colorRectangle';
import { ComparisonGrid2x2, TCompRow } from '../comparisonGrid/comparisonGrid';
import { ReactComponent as WarningIcon } from '@epam/assets/icons/common/notification-warning-fill-24.svg';

export function ThemeVarExample(props: { themeVar: IThemeVar }) {
    const { themeVar } = props;

    if (themeVar.type === TVarType.COLOR) {
        const { value, ref } = getValueForCurrentTheme(themeVar);
        const expectedColorHex = value as THexaValue;
        let cssVar: string | undefined;
        if (ref?.supported) {
            cssVar = ref.cssVar;
        }
        const renderActualLabel = (actualHex: string | undefined) => {
            const result: React.ReactNode[] = [];
            if (actualHex) {
                result.push(`hex: ${actualHex}`);
                result.push('');
                if (actualHex !== expectedColorHex) {
                    result.push(<IconContainer icon={ WarningIcon } />);
                }
            } else {
                result.push(<IconContainer icon={ WarningIcon } />);
            }
            return result;
        };
        const renderExpectedLabel = () => {
            const result: React.ReactNode[] = [
                `hex: ${expectedColorHex}`,
            ];
            result.push(`var: ${cssVar || 'n/a'}`);
            return result;
        };

        const arr: TCompRow[] = [];
        arr.push({
            actual: (
                <ColorRectangle
                    color={ `var(${themeVar.cssVar})` }
                    calcColor={ true }
                    renderLabel={ renderActualLabel }
                />
            ),
            expected: (
                <ColorRectangle
                    color={ expectedColorHex }
                    calcColor={ true }
                    renderLabel={ renderExpectedLabel }
                />
            ),
        });

        return (
            <ComparisonGrid2x2 compArr={ arr } />
        );
    }
    return (
        <div>{ `Variable type ${themeVar.type} is not supported yet`}</div>
    );
}

function getValueForCurrentTheme(themeVar: IThemeVar) {
    const themeCurrent = getCurrentTheme();
    const themeEpamToFigma: Record<TTheme, TFigmaThemeName> = {
        [TTheme.electric]: TFigmaThemeName.EPAM,
        [TTheme.promo]: TFigmaThemeName.PROMO,
        [TTheme.loveship]: TFigmaThemeName.LOVESHIP_LIGHT,
        [TTheme.loveship_dark]: TFigmaThemeName.LOVESHIP_DARK,
        [TTheme.vanilla_thunder]: TFigmaThemeName.EPAM, // TBD
    };
    const figmaTheme = themeEpamToFigma[themeCurrent];
    return themeVar.value[figmaTheme];
}
