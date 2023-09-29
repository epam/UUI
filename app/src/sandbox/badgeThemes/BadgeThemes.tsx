import React, { MutableRefObject } from 'react';
import { FlexCell } from '@epam/uui-components';
import { useUuiContext } from '@epam/uui-core';
import { Theme } from '../../common';
import { Badge as UuiBadge, BadgeProps as UuiBadgeProps, Text } from '@epam/uui';
import { Badge as LoveshipBadge, BadgeProps as LoveshipBadgeProps } from '@epam/loveship';
import { Badge as PromoBadge, BadgeProps as PromoBadgeProps } from '@epam/promo';

const uuiBadges: Array<UuiBadgeProps & { key: string }> = [
    { key: '1', indicator: true, size: '48', color: 'neutral' },
    { key: '3', indicator: true, size: '30', color: 'info' },
    { key: '4', indicator: true, size: '24', color: 'success' },
    { key: '5', indicator: true, size: '18', color: 'warning' },
    { key: '6', indicator: true, size: '48', color: 'error' },
    { key: '7', fill: 'outline', indicator: true, size: '48', color: 'neutral' },
    { key: '9', fill: 'outline', indicator: true, size: '30', color: 'info' },
    { key: '10', fill: 'outline', indicator: true, size: '24', color: 'success' },
    { key: '11', fill: 'outline', indicator: true, size: '18', color: 'warning' },
    { key: '12', fill: 'outline', indicator: true, size: '48', color: 'error' },
];

const loveshipBadges: Array<LoveshipBadgeProps & { key: string }> = [
    { key: '1', indicator: true, shape: 'round', size: '42', color: 'white' },
    { key: '2', indicator: true, shape: 'round', size: '42', color: 'sky' },
    { key: '1', indicator: true, shape: 'round', size: '42', color: 'grass' },
    { key: '3', indicator: true, shape: 'round', size: '42', color: 'sun' },
    { key: '4', indicator: true, shape: 'round', size: '42', color: 'fire' },
    { key: '5', indicator: true, shape: 'round', size: '42', color: 'yellow' },
    { key: '6', indicator: true, shape: 'round', size: '42', color: 'orange' },
    { key: '7', fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'white' },
    { key: '8', fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'sky' },
    { key: '9', fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'grass' },
    { key: '10', fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'sun' },
    { key: '11', fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'fire' },
    { key: '12', fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'yellow' },
    { key: '13', fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'orange' },
    { key: '14', indicator: true, shape: 'round', size: '42', color: 'fuchsia' },
    { key: '15', indicator: true, shape: 'round', size: '42', color: 'purple' },
    { key: '16', indicator: true, shape: 'round', size: '42', color: 'violet' },
    { key: '17', indicator: true, shape: 'round', size: '42', color: 'cobalt' },
    { key: '18', indicator: true, shape: 'round', size: '42', color: 'night100' },
    { key: '19', indicator: true, shape: 'round', size: '42', color: 'night300' },
    { key: '20', indicator: true, shape: 'round', size: '42', color: 'night600' },
    { key: '21', fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'fuchsia' },
    { key: '22', fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'purple' },
    { key: '23', fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'violet' },
    { key: '24', fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'cobalt' },
    { key: '25', fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'night100' },
    { key: '26', fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'night300' },
    { key: '27', fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'night600' },
];

const promoBadges: Array<PromoBadgeProps & { key: string }> = [
    { key: '1', indicator: true, size: '42', color: 'white' },
    { key: '2', indicator: true, size: '42', color: 'blue' },
    { key: '3', indicator: true, size: '42', color: 'green' },
    { key: '4', indicator: true, size: '42', color: 'amber' },
    { key: '5', indicator: true, size: '42', color: 'red' },
    { key: '6', indicator: true, size: '42', color: 'yellow' },
    { key: '7', indicator: true, size: '42', color: 'orange' },
    { key: '8', fill: 'outline', indicator: true, size: '42', color: 'white' },
    { key: '9', fill: 'outline', indicator: true, size: '42', color: 'blue' },
    { key: '10', fill: 'outline', indicator: true, size: '42', color: 'green' },
    { key: '11', fill: 'outline', indicator: true, size: '42', color: 'amber' },
    { key: '12', fill: 'outline', indicator: true, size: '42', color: 'red' },
    { key: '13', fill: 'outline', indicator: true, size: '42', color: 'yellow' },
    { key: '14', fill: 'outline', indicator: true, size: '42', color: 'orange' },
    { key: '15', indicator: true, size: '42', color: 'fuchsia' },
    { key: '16', indicator: true, size: '42', color: 'purple' },
    { key: '17', indicator: true, size: '42', color: 'violet' },
    { key: '18', indicator: true, size: '42', color: 'cobalt' },
    { key: '19', indicator: true, size: '42', color: 'gray10' },
    { key: '20', indicator: true, size: '42', color: 'gray30' },
    { key: '21', indicator: true, size: '42', color: 'gray60' },
    { key: '22', fill: 'outline', indicator: true, size: '42', color: 'fuchsia' },
    { key: '23', fill: 'outline', indicator: true, size: '42', color: 'purple' },
    { key: '24', fill: 'outline', indicator: true, size: '42', color: 'violet' },
    { key: '25', fill: 'outline', indicator: true, size: '42', color: 'cobalt' },
    { key: '26', fill: 'outline', indicator: true, size: '42', color: 'gray10' },
    { key: '27', fill: 'outline', indicator: true, size: '42', color: 'gray30' },
    { key: '28', fill: 'outline', indicator: true, size: '42', color: 'gray60' },
];

const electricBadges: Array<PromoBadgeProps & { key: string }> = [
    { key: '1', indicator: true, size: '42', color: 'white' },
    { key: '2', indicator: true, size: '42', color: 'yellow' },
    { key: '3', indicator: true, size: '42', color: 'orange' },
    { key: '4', indicator: true, size: '42', color: 'fuchsia' },
    { key: '5', indicator: true, size: '42', color: 'purple' },
    { key: '6', indicator: true, size: '42', color: 'violet' },
    { key: '7', indicator: true, size: '42', color: 'cobalt' },
    { key: '8', fill: 'outline', indicator: true, size: '42', color: 'white' },
    { key: '9', fill: 'outline', indicator: true, size: '42', color: 'yellow' },
    { key: '10', fill: 'outline', indicator: true, size: '42', color: 'orange' },
    { key: '11', fill: 'outline', indicator: true, size: '42', color: 'fuchsia' },
    { key: '12', fill: 'outline', indicator: true, size: '42', color: 'purple' },
    { key: '13', fill: 'outline', indicator: true, size: '42', color: 'violet' },
    { key: '14', fill: 'outline', indicator: true, size: '42', color: 'cobalt' },
];

export function BadgeThemes() {
    const { uuiApp: { appTheme } } = useUuiContext<any, { appTheme: MutableRefObject<Theme> }>();

    const getThemeName:() => string = () => {
        switch (appTheme.current) {
            case 'uui-theme-promo': return 'Promo';
            case 'uui-theme-loveship': return 'Loveship';
            case 'uui-theme-loveship_dark': return 'Loveship Dark';
            case 'uui-theme-electric': return 'Electric';
            default: return appTheme.current;
        }
    };

    const getCaption = (badgeItem: { color?: string, size?: number | string }) => `${badgeItem.color.split('')[0].toUpperCase()}${badgeItem.color.slice(1)}`;

    return (
        <div style={ { display: 'flex', flexDirection: 'column', gap: '48px 0', backgroundColor: appTheme.current === 'uui-theme-loveship_dark' ? '#1c1c1c' : 'transparent' } }>
            <FlexCell>
                <Text fontSize="24" font="semibold">UUI</Text>
                <div style={ {
                    padding: '24px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, max-content)',
                    gap: '12px 9px',
                    justifyItems: 'center',
                    alignItems: 'center',
                } }
                >
                    { uuiBadges.map((b) => <UuiBadge key={ b.key } { ...b } caption={ getCaption(b) } count={ b.size } onClick={ () => {} } />)}
                </div>
            </FlexCell>

            {(appTheme.current === 'uui-theme-promo' || appTheme.current === 'uui-theme-loveship' || appTheme.current === 'uui-theme-loveship_dark')
                && (
                    <FlexCell>
                        <Text fontSize="24" font="semibold">{ getThemeName()}</Text>
                        <div style={ {
                            padding: '24px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(7, max-content)',
                            gap: '12px 9px',
                            justifyItems: 'center',
                            alignItems: 'center',
                        } }
                        >
                            { appTheme.current === 'uui-theme-promo' && promoBadges.map((b) => <PromoBadge key={ b.key } { ...b } caption={ getCaption(b) } count={ b.size } onClick={ () => {} } />) }
                            { appTheme.current === 'uui-theme-loveship' && (loveshipBadges.map((b) => <LoveshipBadge key={ b.key } { ...b } caption={ getCaption(b) } count={ b.size } onClick={ () => {} } />)) }
                            { appTheme.current === 'uui-theme-loveship_dark' && (loveshipBadges.map((b) => <LoveshipBadge key={ b.key } { ...b } caption={ getCaption(b) } count={ b.size } onClick={ () => {} } />)) }
                        </div>
                    </FlexCell>
                )}

            {appTheme.current === 'uui-theme-electric'
                && (
                    <FlexCell>
                        <Text fontSize="24" font="semibold">{ getThemeName()}</Text>
                        <div style={ {
                            padding: '24px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(7, max-content)',
                            gap: '12px 9px',
                            justifyItems: 'center',
                            alignItems: 'center',
                        } }
                        >
                            { (electricBadges.map((b) => <PromoBadge key={ b.key } { ...b } caption={ getCaption(b) } count={ b.size } onClick={ () => {} } />)) }
                        </div>
                    </FlexCell>
                )}

        </div>
    );
}
