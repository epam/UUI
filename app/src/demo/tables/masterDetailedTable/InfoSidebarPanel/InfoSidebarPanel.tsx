import React from 'react';
import {
    FlexCell, FlexRow, FlexSpacer, IconButton, Panel, Text,
} from '@epam/promo';
import { ReactComponent as CrossIcon } from '@epam/assets/icons/common/navigation-close-24.svg';
import { cx } from '@epam/uui-core';
import { PersonTableRecord } from '../types';
import css from './InfoSidebarPanel.module.scss';
import { LocationInfo } from './LocationInfo';
import { PersonGroupInfo } from './PersonGroupInfo';
import { PersonInfo } from './PersonInfo';

interface SidebarPanelProps {
    data: PersonTableRecord;
    isVisible: boolean;
    onClose(): void;
}

export function InfoSidebarPanel({ data, isVisible, onClose }: SidebarPanelProps) {
    let panelInfo;
    if (data && data.__typename === 'Location') {
        panelInfo = <LocationInfo data={ data } />;
    }
    
    if (data && data.__typename === 'PersonGroup') {
        panelInfo = <PersonGroupInfo data={ data } />;
    }
    
    if (data && data.__typename === 'Person') {
        panelInfo = <PersonInfo data={ data } />;
    }

    return (
        <div className={ cx(css.infoSidebarPanelWrapper, isVisible ? 'show' : 'hide') }>
            <Panel cx={ css.wrapper } background="white">
                <FlexRow borderBottom padding="24">
                    <Text size="48" font="sans-semibold">
                        Detailed Information
                    </Text>
                    <FlexSpacer />
                    <FlexCell shrink={ 0 } width="auto">
                        <IconButton icon={ CrossIcon } onClick={ onClose } />
                    </FlexCell>
                </FlexRow>
                {panelInfo}
            </Panel>
        </div>
    );
}
