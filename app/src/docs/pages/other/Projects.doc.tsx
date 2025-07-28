import * as React from 'react';
import { Icon } from '@epam/uui-core';
import { FlexCell, FlexRow, FlexSpacer, IconContainer, LinkButton, Text } from '@epam/uui';
import { ContentSection } from '../../../common';
import css from './ProjectsDoc.module.scss';

import { ReactComponent as AssessmentIcon } from '../../../icons/assessment.svg';
import { ReactComponent as AnywhereIcon } from '../../../icons/anywhere.svg';
import { ReactComponent as DataCatalogIcon } from '../../../icons/data_catalog.svg';
import { ReactComponent as EmploymentVerificationLetterIcon } from '../../../icons/employment_verification_letter.svg';
import { ReactComponent as EthicsLineIcon } from '../../../icons/ethics_line.svg';
import { ReactComponent as PeopleIcon } from '../../../icons/people.svg';
import { ReactComponent as OnboardingIcon } from '../../../icons/adaptation.svg';
import { ReactComponent as GrowIcon } from '../../../icons/grow.svg';
import { ReactComponent as LearnIcon } from '../../../icons/learn.svg';
import { ReactComponent as HeroesIcon } from '../../../icons/heroes.svg';
import { ReactComponent as LevelUpIcon } from '../../../icons/levelup.svg';
import { ReactComponent as TimeIcon } from '../../../icons/time.svg';
import { ReactComponent as FeedbackIcon } from '../../../icons/feedback.svg';
import { ReactComponent as UnifiedProfileIcon } from '../../../icons/unified_profile.svg';
import { ReactComponent as SkillsIcon } from '../../../icons/skills-logo.svg';
import { ReactComponent as DefaultIcon } from '../../../icons/design_platform.svg';
import { ReactComponent as LinkIcon } from '../../../icons/action-external_link-18.svg';
import { ReactComponent as VacationIcon } from '../../../icons/vacation.svg';
import { ReactComponent as MenuIcon } from '../../../icons/menu.svg';
import { ReactComponent as DeskIcon } from '../../../icons/desk.svg';
import { ReactComponent as TalkIcon } from '../../../icons/talk-logo.svg';
import { ReactComponent as TelescopeIcon } from '@epam/assets/icons/common/communication-telescope-24.svg';
import { ReactComponent as BillingIcon } from '../../../icons/billing.svg';
import { ReactComponent as TrainingCenterIcon } from '../../../icons/training-center-logo.svg';
import { ReactComponent as RewardsIcon } from '../../../icons/rewards-logo.svg';
import { ReactComponent as InviteIcon } from '../../../icons/Invite-logo.svg';

export const projectsList: Array<{ projectName: string; projectCode: string; icon: Icon; url: string }> = [
    {
        projectName: 'Learn', projectCode: 'EPM-TMC', icon: LearnIcon, url: 'https://learn.epam.com',
    }, {
        projectName: 'Heroes', projectCode: 'EPM-HERO', icon: HeroesIcon, url: 'https://heroes.epam.com',
    }, {
        projectName: 'People', projectCode: 'EPM-HRMS', icon: PeopleIcon, url: 'https://people.epam.com/',
    }, {
        projectName: 'Assessment', projectCode: 'EPM-ASMD', icon: AssessmentIcon, url: 'https://asmt.epam.com',
    }, {
        projectName: 'Level Up', projectCode: 'EPM-LVUP', icon: LevelUpIcon, url: 'https://levelup.epam.com/',
    }, {
        projectName: 'Grow', projectCode: 'EPM-GROW', icon: GrowIcon, url: 'https://grow.epam.com',
    }, {
        projectName: 'Time', projectCode: 'EPM-TIME', icon: TimeIcon, url: 'https://time.epam.com/',
    }, {
        projectName: 'Onboarding', projectCode: 'EPM-ADPT', icon: OnboardingIcon, url: 'https://onboarding.epam.com/',
    }, {
        projectName: 'Vacations', projectCode: 'EPM-VTS', icon: VacationIcon, url: 'https://vacation.epam.com/',
    }, {
        projectName: 'Feedback', projectCode: 'EPM-RVM', icon: FeedbackIcon, url: 'https://feedback.epam.com',
    }, {
        projectName: 'Billing', projectCode: 'EPM-BSRV', icon: BillingIcon, url: 'https://billing.epam.com/',
    }, {
        projectName: 'Eco Toolkit', projectCode: 'EPM-ECO', icon: DefaultIcon, url: '',
    }, {
        projectName: 'Employment Verification Letter', projectCode: 'EPM-GOOG', icon: EmploymentVerificationLetterIcon, url: 'https://letter.epam.com/',
    }, {
        projectName: 'EPAM Anywhere', projectCode: 'EPM-COSR', icon: AnywhereIcon, url: 'https://anywhere.epam.com/',
    }, {
        projectName: 'EthicsLine', projectCode: 'EPM-EIL', icon: EthicsLineIcon, url: 'https://ethics.epam.com/',
    }, {
        projectName: 'CLMS (contract lifecycle management system)', icon: DefaultIcon, projectCode: 'EPM-AMSP', url: '',
    }, {
        projectName: 'Checklist', projectCode: 'EPM-ICN', icon: DefaultIcon, url: 'https://checklist.epam.com',
    }, {
        projectName: 'SimplePay', projectCode: 'EPM-SBCM', icon: DefaultIcon, url: 'https://simplepay.epam.com/',
    }, {
        projectName: 'Unified Profile', projectCode: 'EPM-HRMS', icon: UnifiedProfileIcon, url: 'https://profile.epam.com/',
    }, {
        projectName: 'Data-catalog', projectCode: 'EPM-ECO', icon: DataCatalogIcon, url: 'https://data-catalog.paas.epam.com/',
    }, {
        projectName: 'Contracts', projectCode: 'EPM-VCMS', icon: DefaultIcon, url: undefined,
    }, {
        projectName: 'Skillo', projectCode: 'EPM-DMTM', icon: SkillsIcon, url: 'https://skillo.epam.com/',
    }, {
        projectName: 'EPM-PBI', projectCode: 'EPM-PBI', icon: DefaultIcon, url: undefined,
    }, {
        projectName: 'Black Book Web', projectCode: 'EPM-BBW', icon: DefaultIcon, url: 'https://blackbook.epam.com/home',
    }, {
        projectName: 'EPM-TALK', projectCode: 'EPM-TALK', icon: TalkIcon, url: 'https://telescope.epam.com/who/?tab=wall',
    }, {
        projectName: 'Global Menu', projectCode: 'EPM-HIVE', icon: MenuIcon, url: 'https://menu.epam.com/app',
    }, {
        projectName: 'Desk', projectCode: 'EPM-OSM', icon: DeskIcon, url: 'https://desk.epam.com/app-react/home',
    }, {
        projectName: 'Training center', projectCode: 'EPM-RDPT', icon: TrainingCenterIcon, url: 'https://training.by',
    }, {
        projectName: 'Rewards', projectCode: 'EPM-RCGN', icon: RewardsIcon, url: 'https://rewards.epam.com/',
    }, {
        projectName: 'Invite', projectCode: 'EPM-REF', icon: InviteIcon, url: 'https://invite.epam.com/',
    }, {
        projectName: 'Experts', projectCode: 'EPMD-CERT', icon: InviteIcon, url: 'https://experts.epam.com/',
    },
];

export class ProjectsDoc extends React.Component {
    getTeamLink = (projectCode: string): string => {
        const encodedQuery = btoa(JSON.stringify({ text: `project:${projectCode}` }));
        return `https://telescope.epam.com/search/people?h=${encodedQuery}`;
    };

    render() {
        return (
            <ContentSection>
                <div className={ css.title }>Projects</div>

                <div className={ css.layout }>
                    {projectsList.map((project) => (
                        <div key={ project.projectName } className={ css.projectContainer }>
                            <FlexRow cx={ css.projectRow } padding="18">
                                <IconContainer icon={ project.icon } size={ 72 } />
                                <FlexCell width="auto" cx={ css.projectDescription }>
                                    {project.url ? (
                                        <LinkButton
                                            size="30"
                                            caption={ project.projectName }
                                            target="_blank"
                                            href={ project.url }
                                            icon={ LinkIcon }
                                            iconPosition="right"
                                            cx={ css.projectLink }
                                        />
                                    ) : (
                                        <Text fontSize="24" lineHeight="30" cx={ css.projectName }>
                                            {project.projectName}
                                        </Text>
                                    )}
                                    <Text color="secondary" cx={ css.projectCode }>
                                        {project.projectCode}
                                    </Text>
                                </FlexCell>
                                <FlexSpacer />
                                <LinkButton cx={ css.teamLink } target="_blank" icon={ TelescopeIcon } caption="View Team" href={ this.getTeamLink(project.projectCode) } />
                            </FlexRow>
                        </div>
                    ))}
                </div>
            </ContentSection>
        );
    }
}
