import React from 'react';
import {
    FlexCell, FlexRow, FlexSpacer, IconButton, Panel, Text,
} from '@epam/uui';
import { ReactComponent as CrossIcon } from '@epam/assets/icons/common/navigation-close-24.svg';
import { cx } from '@epam/uui-core';
import { PersonTableRecord } from '../types';
import css from './InfoSidebarPanel.module.scss';
import { PersonInfo } from './PersonInfo';

interface SidebarPanelProps {
    data: PersonTableRecord;
    isVisible: boolean;
    onClose(): void;
}

export function InfoSidebarPanel({ data, isVisible, onClose }: SidebarPanelProps) {
    if (!data || data.__typename !== 'Person') {
        return null;
    }

    return (
        <div className={ cx(css.infoSidebarPanelWrapper, isVisible ? 'show' : 'hide') }>
            <Panel cx={ css.wrapper }>
                <FlexRow borderBottom padding="24">
                    <Text size="48" fontWeight="600">
                        Detailed Information
                    </Text>
                    <FlexSpacer />
                    <FlexCell shrink={ 0 } width="auto">
                        <IconButton icon={ CrossIcon } onClick={ onClose } />
                    </FlexCell>
                </FlexRow>
                <PersonInfo data={ data } />
            </Panel>
        </div>
    );
}
