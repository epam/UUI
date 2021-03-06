import * as React from 'react';
import { Icon } from '@epam/uui';
import { FlexCell, FlexRow, FlexSpacer, IconContainer, LinkButton, Text, Tooltip } from '@epam/promo';
import { ContentSection } from '../../common';
import * as css from './ProjectsDoc.scss';

import * as assessmentIcon from '../../icons/assessment.svg';
import * as anywhereIcon from '../../icons/anywhere.svg';
import * as dataCatalogIcon from '../../icons/data_catalog.svg';
import * as employmentVerificationLetterIcon from '../../icons/employment_verification_letter.svg';
import * as ethicsLineIcon from '../../icons/ethics_line.svg';
import * as peopleIcon from '../../icons/people.svg';
import * as onboardingIcon from '../../icons/adaptation.svg';
import * as growIcon from '../../icons/grow.svg';
import * as learnIcon from '../../icons/learn.svg';
import * as heroesIcon from '../../icons/heroes.svg';
import * as levelUpIcon from '../../icons/levelup.svg';
import * as timeIcon from '../../icons/time.svg';
import * as feedbackIcon from '../../icons/feedback.svg';
import * as unifiedProfileIcon from '../../icons/unified_profile.svg';
import * as skillsIcon from '../../icons/skills-logo.svg';
import * as defaultIcon from '../../icons/design_platform.svg';
import * as linkIcon from '../../icons/action-external_link-18.svg';
import * as vacationIcon from '../../icons/vacation.svg';
import * as menuIcon from '../../icons/menu.svg';
import * as deskIcon from '../../icons/desk.svg';
import * as talkIcon from '../../icons/talk-logo.svg';
import * as telescopeIcon from '@epam/assets/icons/common/communication-telescope-24.svg';

export const projectsList: Array<{ projectName: string, projectCode: string, icon: Icon, url: string }> = [
    { projectName: 'Learn', projectCode: 'EPM-TMC', icon: learnIcon, url: 'https://learn.epam.com' },
    { projectName: 'Heroes', projectCode: 'EPM-HERO', icon: heroesIcon, url: 'https://heroes.epam.com' },
    { projectName: 'People', projectCode: 'EPM-HRMS', icon: peopleIcon, url: 'https://people.epam.com/' },
    { projectName: 'Assessment', projectCode: 'EPM-ASMD', icon: assessmentIcon, url: 'https://asmt.epam.com' },
    { projectName: 'Level Up', projectCode: 'EPM-LVUP', icon: levelUpIcon, url: 'https://levelup.epam.com/' },
    { projectName: 'Grow', projectCode: 'EPM-GROW', icon: growIcon, url: 'https://grow.epam.com' },
    { projectName: 'Time', projectCode: 'EPM-TIME', icon: timeIcon, url: 'https://time.epam.com/' },
    { projectName: 'Onboarding', projectCode: 'EPM-ADPT', icon: onboardingIcon, url: 'https://onboarding.epam.com/' },
    { projectName: 'Vacations', projectCode: 'EPM-VTS', icon: vacationIcon, url: 'https://vacation.epam.com/' },
    { projectName: 'Feedback', projectCode: 'EPM-RVM', icon: feedbackIcon, url: 'https://feedback.epam.com' },
    { projectName: 'Billing', projectCode: 'EPM-BSRV', icon: defaultIcon, url: 'https://billing.epam.com/' },
    { projectName: 'Eco Toolkit', projectCode: 'EPM-ECO', icon: defaultIcon, url: '' },
    { projectName: 'Employment Verification Letter', projectCode: 'EPM-GOOG', icon: employmentVerificationLetterIcon, url: 'https://letter.epam.com/' },
    { projectName: 'EPAM Anywhere', projectCode: 'EPM-COSR', icon: anywhereIcon, url: 'https://anywhere.epam.com/' },
    { projectName: 'EthicsLine', projectCode: 'EPM-EIL', icon: ethicsLineIcon, url: 'https://ethics.epam.com/' },
    { projectName: 'CLMS (contract lifecycle management system)', icon: defaultIcon, projectCode: 'EPM-AMSP', url: '' },
    { projectName: 'Checklist', projectCode: 'EPM-ICN', icon: defaultIcon, url: 'https://checklist.epam.com' },
    { projectName: 'SimplePay', projectCode: 'EPM-SBCM', icon: defaultIcon, url: 'https://simplepay.epam.com/' },
    { projectName: 'Unified Profile', projectCode: 'EPM-HRMS', icon: unifiedProfileIcon, url: 'https://profile.epam.com/' },
    { projectName: 'Data-catalog', projectCode: 'EPM-ECO', icon: dataCatalogIcon, url: 'https://data-catalog.paas.epam.com/' },
    { projectName: 'Contracts', projectCode: 'EPM-VCMS', icon: defaultIcon, url: undefined },
    { projectName: 'Skillo', projectCode: 'EPM-DMTM', icon: skillsIcon, url: 'https://skillo.epam.com/' },
    { projectName: 'EPM-PBI', projectCode: 'EPM-PBI', icon: defaultIcon, url: undefined },
    { projectName: 'Black Book Web', projectCode: 'EPM-BBW', icon: defaultIcon, url: 'https://blackbook.epam.com/home' },
    { projectName: 'EPM-TALK', projectCode: 'EPM-TALK', icon: talkIcon, url: 'https://telescope.epam.com/who/?tab=wall' },
    { projectName: 'Global Menu', projectCode: 'EPM-HIVE', icon: menuIcon, url: 'https://menu.epam.com/app' },
    { projectName: 'Desk', projectCode: 'EPM-OSM', icon: deskIcon, url: 'https://desk.epam.com/app-react/home' },
];

export class ProjectsDoc extends React.Component {
    getTeamLink = (projectCode: string): string => {
        const encodedQuery = btoa(JSON.stringify({ text: `project:${ projectCode }` }));
        return `https://telescope.epam.com/search/people?h=${ encodedQuery }`;
    }

    render() {
        return (
            <ContentSection>
                <div className={ css.title }>Projects</div>

                <div className={ css.layout }>
                    { projectsList.map((project) => (
                        <div key={ project.projectName } className={ css.projectContainer }>
                            <FlexRow cx={ css.projectRow } padding='18'>
                                <IconContainer icon={ project.icon } size={ 72 }/>
                                <FlexCell width='auto' cx={ css.projectDescription }>
                                    {
                                        project.url ?
                                            <LinkButton size='30' caption={ project.projectName } target='_blank'
                                                        href={ project.url } icon={ linkIcon } iconPosition='right'
                                                        cx={ css.projectLink }/> :
                                            <Text font='museo-sans' fontSize='24' lineHeight='30'
                                                  cx={ css.projectName }>{ project.projectName }</Text>
                                    }
                                    <Text color='gray60' cx={ css.projectCode }>{ project.projectCode }</Text>
                                </FlexCell>
                                <FlexSpacer/>
                                <LinkButton cx={ css.teamLink } target='_blank' icon={ telescopeIcon } caption='View Team' href={ this.getTeamLink(project.projectCode) }/>
                            </FlexRow>
                        </div>
                    ))
                    }
                </div>
            </ContentSection>
        );
    }
}