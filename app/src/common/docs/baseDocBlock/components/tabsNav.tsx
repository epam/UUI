import * as React from 'react';
import { FlexRow, FlexSpacer, TabButton } from '@epam/uui';
import { TMode } from '../../docsConstants';
import css from './tabsNav.module.scss';

type TTabsNavProps = {
    mode: TMode;
    supportedModes: TMode[];
    onChangeMode: (mode: TMode) => void;
    renderSkinSwitcher: () => React.ReactNode;
};

export function TabsNav(props: TTabsNavProps) {
    const { mode, onChangeMode, renderSkinSwitcher, supportedModes } = props;

    if (supportedModes.length === 1) {
        return null;
    }

    const allTabs = {
        [TMode.doc]: {
            caption: 'Documentation',
            tooltip: '',
        },
        [TMode.propsEditor]: {
            caption: 'Property Explorer',
            tooltip: '',
        },
    };

    return (
        <FlexRow
            rawProps={ { role: 'tablist' } }
            padding="12"
            cx={ [css.secondaryNavigation] }
            borderBottom
        >
            {
                Object.keys(allTabs).reduce<React.ReactNode[]>((acc, tm) => {
                    if (supportedModes.includes(tm as TMode) || (tm as TMode) === mode) {
                        const data = allTabs[tm as TMode];
                        acc.push((
                            <TabButton
                                key={ tm }
                                size="60"
                                caption={ data.caption }
                                isLinkActive={ mode === tm }
                                rawProps={ { title: data.tooltip } }
                                onClick={ () => onChangeMode(tm as TMode) }
                            />
                        ));
                    }
                    return acc;
                }, [])
            }
            <FlexSpacer />
            {renderSkinSwitcher()}
        </FlexRow>
    );
}
