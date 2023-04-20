import * as React from 'react';
import { FlexRow, Text } from '@epam/promo';
import css from './BenefitsBlock.scss';
import { cx } from '@epam/uui-core';
import { svc } from '../services';
import { analyticsEvents } from '../analyticsEvents';

export interface BenefitsBlockState {
    reason: 'BattleTestedSolution' | 'SavesEfforts' | 'WorkInCooperation' | 'CuttingEdgeStack';
}

const benefits: any = {
    BattleTestedSolution: {
        caption: 'Battle-Tested Solution',
        points: [
            '15+ products are already built, 10+ products are currently in development.',
            'UUI design skins comply with EPAM branding. So, every internal product promotes EPAM in that way.',
            '50 person-years of experience baked in. UUI is the product of 5 years developing 20+ apps.',
        ],
    },
    SavesEfforts: {
        caption: 'Saves Efforts & Speeds Up Work',
        points: [
            'Ready set of design elements allows designers and developers to create user interface 3-4x faster. More features in less time.',
            'Allows spending more time on research, making new features and user testing.',
            'Safe & easy on-boarding/rotation process: newcomers quickly dive into UX/UI on any internal project.',
        ],
    },
    WorkInCooperation: {
        caption: 'Work in Cooperation',
        points: [
            'Continuous development: dedicated coordinator, several design teams regularly contribute while working on their projects.',
            'Continuous collaboration: common set of design elements for many different products encourages teams to communicate more and closer.\n' +
                'As a result, the most applicable common UX patterns for all EPAM products are developed.',
            'Design & Front-End close cooperation: teams build together EPAM UX/UI standards complying with business & technical constraints.',
            "Happy & motivated team: we encourage contribution, we've got challenges, and we are happy to help newcomers.",
        ],
    },
    CuttingEdgeStack: {
        caption: 'Cutting-edge Stack',
        points: [
            'Rich set of components: from buttons, to spinners.',
            'Common services: modals, notifications, error recovery, forms and data binding, monitoring, and more.',
            "Not opinionated, you don't have to go all in: it's compatible with CRA, Babel/TypeScript, LESS/SASS, Apollo/Redux.",
        ],
    },
};

export class BenefitsBlock extends React.Component<{}, BenefitsBlockState> {
    state: BenefitsBlockState = {
        reason: 'BattleTestedSolution',
    };

    handleChangeReason = (reason: BenefitsBlockState['reason']) => {
        this.setState({
            reason: reason,
        });
        svc.uuiAnalytics.sendEvent(analyticsEvents.welcome.whyToUse(reason));
    };

    render() {
        return (
            <div className={css.layout}>
                <FlexRow cx={css.benefits} borderBottom>
                    <div className={css.wrapper}>
                        <Text font="museo-sans" cx={css.header}>
                            Why to Use
                        </Text>
                        <div className={css.content}>
                            <div className={css.actionsWrapper}>
                                <ul role="tablist" className={css.actionsContainer}>
                                    {Object.keys(benefits).map((reason: any) => (
                                        <li
                                            role="tab"
                                            tabIndex={0}
                                            aria-controls={this.state.reason}
                                            aria-current={this.state.reason === reason}
                                            key={reason}
                                            onKeyDown={({ key }) => (key === ' ' || key === 'Enter') && this.handleChangeReason(reason)}
                                            onClick={() => this.handleChangeReason(reason)}
                                            className={cx(css.reason, this.state.reason === reason && css.reasonActive)}
                                        >
                                            <Text
                                                cx={css.reasonCaption}
                                                font="museo-sans"
                                                color={this.state.reason === reason ? 'gray80' : 'gray60'}
                                                fontSize="24"
                                                lineHeight="30"
                                            >
                                                {benefits[reason].caption}
                                            </Text>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <ul id={this.state.reason}>
                                {benefits[this.state.reason].points.map((point: string, index: number) => (
                                    <li key={index} className={css.pointWrapper}>
                                        <Text font="sans" fontSize="24" cx={css.point}>
                                            {point}
                                        </Text>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </FlexRow>
            </div>
        );
    }
}
