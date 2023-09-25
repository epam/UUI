import React, { MutableRefObject } from 'react';
import { FlexCell } from '@epam/uui-components';
import { useUuiContext } from '@epam/uui-core';
import { Theme } from '../../common';
import { Badge as UuiBadge, BadgeProps as UuiBadgeProps, Text } from '@epam/uui';
import { Badge as LoveshipBadge, BadgeProps as LoveshipBadgeProps } from '@epam/loveship';
import { Badge as PromoBadge, BadgeProps as PromoBadgeProps } from '@epam/promo';

const uuiBadges: UuiBadgeProps[] = [
    { indicator: true, size: '48', color: 'neutral' },
    { indicator: true, size: '42', color: 'white' },
    { indicator: true, size: '30', color: 'info' },
    { indicator: true, size: '24', color: 'success' },
    { indicator: true, size: '18', color: 'warning' },
    { indicator: true, size: '48', color: 'critical' },
];

const loveshipBadges: LoveshipBadgeProps[] = [
    { indicator: true, shape: 'round', size: '42', color: 'white' },
    { indicator: true, shape: 'round', size: '42', color: 'sky' },
    { indicator: true, shape: 'round', size: '42', color: 'grass' },
    { indicator: true, shape: 'round', size: '42', color: 'sun' },
    { indicator: true, shape: 'round', size: '42', color: 'fire' },
    { indicator: true, shape: 'round', size: '42', color: 'yellow' },
    { indicator: true, shape: 'round', size: '42', color: 'orange' },
    { fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'white' },
    { fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'sky' },
    { fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'grass' },
    { fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'sun' },
    { fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'fire' },
    { fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'yellow' },
    { fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'orange' },
    { indicator: true, shape: 'round', size: '42', color: 'fuchsia' },
    { indicator: true, shape: 'round', size: '42', color: 'purple' },
    { indicator: true, shape: 'round', size: '42', color: 'lavanda' },
    { indicator: true, shape: 'round', size: '42', color: 'cobalt' },
    { indicator: true, shape: 'round', size: '42', color: 'night100' },
    { indicator: true, shape: 'round', size: '42', color: 'night300' },
    { indicator: true, shape: 'round', size: '42', color: 'night600' },
    { fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'fuchsia' },
    { fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'purple' },
    { fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'lavanda' },
    { fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'cobalt' },
    { fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'night100' },
    { fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'night300' },
    { fill: 'outline', indicator: true, shape: 'round', size: '42', color: 'night600' },
];

const promoBadges: PromoBadgeProps[] = [
    { indicator: true, size: '42', color: 'white' },
    { indicator: true, size: '42', color: 'blue' },
    { indicator: true, size: '42', color: 'green' },
    { indicator: true, size: '42', color: 'amber' },
    { indicator: true, size: '42', color: 'red' },
    { indicator: true, size: '42', color: 'yellow' },
    { indicator: true, size: '42', color: 'orange' },
    { fill: 'outline', indicator: true, size: '42', color: 'white' },
    { fill: 'outline', indicator: true, size: '42', color: 'blue' },
    { fill: 'outline', indicator: true, size: '42', color: 'green' },
    { fill: 'outline', indicator: true, size: '42', color: 'amber' },
    { fill: 'outline', indicator: true, size: '42', color: 'red' },
    { fill: 'outline', indicator: true, size: '42', color: 'yellow' },
    { fill: 'outline', indicator: true, size: '42', color: 'orange' },
    { indicator: true, size: '42', color: 'fuchsia' },
    { indicator: true, size: '42', color: 'purple' },
    { indicator: true, size: '42', color: 'lavanda' },
    { indicator: true, size: '42', color: 'cobalt' },
    { indicator: true, size: '42', color: 'gray10' },
    { indicator: true, size: '42', color: 'gray30' },
    { indicator: true, size: '42', color: 'gray60' },
    { fill: 'outline', indicator: true, size: '42', color: 'fuchsia' },
    { fill: 'outline', indicator: true, size: '42', color: 'purple' },
    { fill: 'outline', indicator: true, size: '42', color: 'lavanda' },
    { fill: 'outline', indicator: true, size: '42', color: 'cobalt' },
    { fill: 'outline', indicator: true, size: '42', color: 'gray10' },
    { fill: 'outline', indicator: true, size: '42', color: 'gray30' },
    { fill: 'outline', indicator: true, size: '42', color: 'gray60' },
];

const electricBadges: PromoBadgeProps[] = [
    { indicator: true, size: '42', color: 'white' },
    { indicator: true, size: '42', color: 'yellow' },
    { indicator: true, size: '42', color: 'orange' },
    { indicator: true, size: '42', color: 'fuchsia' },
    { indicator: true, size: '42', color: 'purple' },
    { fill: 'outline', indicator: true, size: '42', color: 'white' },
    { fill: 'outline', indicator: true, size: '42', color: 'yellow' },
    { fill: 'outline', indicator: true, size: '42', color: 'orange' },
    { fill: 'outline', indicator: true, size: '42', color: 'fuchsia' },
    { fill: 'outline', indicator: true, size: '42', color: 'purple' },
    { indicator: true, size: '42', color: 'lavanda' },
    { indicator: true, size: '42', color: 'cobalt' },
    { indicator: true, size: '42', color: 'gray10' },
    { indicator: true, size: '42', color: 'gray30' },
    { indicator: true, size: '42', color: 'gray60' },
    { fill: 'outline', indicator: true, size: '42', color: 'lavanda' },
    { fill: 'outline', indicator: true, size: '42', color: 'cobalt' },
    { fill: 'outline', indicator: true, size: '42', color: 'gray10' },
    { fill: 'outline', indicator: true, size: '42', color: 'gray30' },
    { fill: 'outline', indicator: true, size: '42', color: 'gray60' },
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
                    gridTemplateColumns: 'repeat(7, max-content)',
                    gap: '12px 9px',
                    justifyItems: 'center',
                    alignItems: 'center',
                } }
                >
                    { uuiBadges.map((b) => <UuiBadge { ...b } caption={ getCaption(b) } count={ b.size } onClick={ () => {} } />)}
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
                            { appTheme.current === 'uui-theme-promo' && promoBadges.map((b) => <PromoBadge { ...b } caption={ getCaption(b) } count={ b.size } onClick={ () => {} } />) }
                            { appTheme.current === 'uui-theme-loveship' && (loveshipBadges.map((b) => <LoveshipBadge { ...b } caption={ getCaption(b) } count={ b.size } onClick={ () => {} } />)) }
                            { appTheme.current === 'uui-theme-loveship_dark' && (loveshipBadges.map((b) => <LoveshipBadge { ...b } caption={ getCaption(b) } count={ b.size } onClick={ () => {} } />)) }
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
                            gridTemplateColumns: 'repeat(5, max-content)',
                            gap: '12px 9px',
                            justifyItems: 'center',
                            alignItems: 'center',
                        } }
                        >
                            { (electricBadges.map((b) => <PromoBadge { ...b } caption={ getCaption(b) } count={ b.size } onClick={ () => {} } />)) }
                        </div>
                    </FlexCell>
                )}

        </div>
    );
}
