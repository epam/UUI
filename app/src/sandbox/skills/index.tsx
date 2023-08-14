import React from 'react';
import { SkillsBatteryPopover } from './SkillsBatteryPopover';
import { ReactComponent as doneIcon } from '@epam/assets/icons/common/notification-done-12.svg';
import { ReactComponent as medalLogo } from './icons/Medal.svg';
import { ReactComponent as personIconFilledSmall } from '@epam/assets/icons/common/social-person-12.svg';
import { ReactComponent as clockIconSmall } from '@epam/assets/icons/common/action-schedule-12.svg';
import { ISkill } from './utils';

const trainingAndDev: ISkill = {
    caption: 'Training and Development',
    level: 2,
    comment: '',
    description: 'At this level, user can understand the main points of clear texts in standard language.',
    options: {
        isProfile: {
            icon: personIconFilledSmall, activeColor: '#14CCCC', prefix: 'Created at', date: new Date('2019,Jun,10'), status: true,
        },
        isRecommended: {
            icon: medalLogo, activeColor: '#FFC000', prefix: 'Last updated', date: new Date('2021,May,10'), status: true,
        },
        isConfirmed: {
            icon: doneIcon, activeColor: '#007BBD', prefix: 'Confirmed by Assessment', date: new Date('2020,Jan,06'), status: true,
        },
        isOutdated: {
            icon: clockIconSmall, activeColor: '#CED0DB', prefix: 'Skill outdated', date: new Date('2020,Sep,18'), status: true,
        },
    },
    lastUpdated: new Date('2021,Mar,03'),
};

export function Skills() {
    return (
        <SkillsBatteryPopover data={ trainingAndDev } />
    );
}
