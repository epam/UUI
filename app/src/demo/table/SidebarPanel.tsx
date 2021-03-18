import * as React from 'react';
import { Badge, EpamAdditionalColor, FlexCell, FlexRow, FlexSpacer, IconButton, Panel, ScrollBars, Text } from '@epam/promo';
import { Person } from '@epam/uui-docs';
import * as css from './SidebarPanel.scss';
import * as  crossIcon from '@epam/assets/icons/common/navigation-close-24.svg';
import { cx } from "@epam/uui";

interface SidebarPanelProps {
    data: Person;
    onClose?: () => void;
    cxSb?: string;
}

export const SidebarPanel: React.FC<SidebarPanelProps> = ({ data, onClose, cxSb }) => {

    const renderInfoRow = (title: string, value: any) => {
        return <FlexRow padding='24' >
            <FlexCell shrink={ 0 } width={ 162 }>
                <Text color='gray60' >{ title }</Text>
            </FlexCell>
            <Text cx={ css.noWrap } >
                { value }
            </Text>
        </FlexRow>;
    };

    return <Panel cx={ cx(css.wrapper, cxSb) } background='white'>
        <FlexRow borderBottom padding='24' >
            <Text size="48" font='sans-semibold'>Detailed Information</Text>
            <FlexSpacer />
            <FlexCell shrink={ 0 } width='auto'><IconButton icon={ crossIcon } onClick={ onClose } /></FlexCell>
        </FlexRow>
        { data &&
            <ScrollBars>
                { renderInfoRow('Name', data.name) }
                { renderInfoRow('Status', <Badge cx={ css.status } caption={ data.profileStatus } fill='transparent' color={ data.profileStatus.toLowerCase() as EpamAdditionalColor } />) }
                { renderInfoRow('Job Title', data.jobTitle) }
                { renderInfoRow('Title Level', data.titleLevel) }
                { renderInfoRow('Office', data.officeAddress) }
                { renderInfoRow('City', data.cityName) }
                { renderInfoRow('Country', data.countryName) }
                { renderInfoRow('Manager', data.managerName) }
                { renderInfoRow('Hire date', new Date(data.hireDate).toLocaleDateString()) }
                { renderInfoRow('Related NPR', data.relatedNPR ? 'Completed' : 'Uncompleted') }
                { renderInfoRow('Department', data.departmentName) }
                { renderInfoRow('Email', data.email) }
                { renderInfoRow('Modified', new Date(data.modifiedDate).toLocaleDateString()) }
                { renderInfoRow('Notes', data.notes || '-') }
                { renderInfoRow('Primary skill', data.primarySkill) }
                { renderInfoRow('Production category', data.productionCategory) }
                { renderInfoRow('UID', data.uid) }
                { renderInfoRow('Birth date', new Date(data.birthDate).toLocaleDateString()) }
            </ScrollBars>
        }
    </Panel>;
};
