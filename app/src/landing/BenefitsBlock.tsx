import * as React from 'react';
import { FlexRow, Text } from '@epam/promo';
import * as css from './BenefitsBlock.scss';
import { cx } from '@epam/uui';
import {svc} from "../services";
import {analyticsEvents} from "../analyticsEvents";

export interface BenefitsBlockState {
    reason: 'BattleTestedSolution' | 'SavesEfforts' | 'WorkInCooperation' | 'CuttingEdgeStack';
}

const benefits: any = {
    'BattleTestedSolution': {
        caption: 'Battle-Tested Solution',
        points: [
            '15+ products are already built, 10+ products are currently in development.',
            'UUI design skins are complied with EPAM branding. So, every internal product promotes EPAM that way.',
            '50 man/years of experience baked in. UUI is an essence of 5 years developing 20+ apps.',
        ],
    },
    'SavesEfforts': {
        caption: 'Saves Efforts & Speeds Up Work',
        points: [
            'Ready set of design elements allows designers and developers to create user interface 3-4x faster. More features for the less time.',
            'Allows to spend more time for research, making new features and user testing.',
            'Safe & easy on-boarding/rotation process: newcomers quickly dive into UX/UI on any internal project',
        ],
    },
    'WorkInCooperation': {
        caption: 'Work in Cooperation',
        points: [
            'Continuous development: dedicated coordinator, several design teams regularly contribute while working on their projects.',
            'Continuous collaboration: common set of design elements for many different products encourages teams to communicate more and closer.\n' +
            'As a result, the most applicable common UX patterns for all EPAM products are developed.',
            'Design & Front-End close cooperation: teams build together EPAM UX/UI standards complying with business & technical constraints.',
            'Happy & motivated team: we encourage contribution, we\'ve got challenges, and we are happy to help newcomers.',
        ],
    },
    'CuttingEdgeStack': {
        caption: 'Cutting-edge Stack',
        points: [
            'Rich set of components: from buttons, to spinners.',
            'Common services: modals, notifications, error recovery, forms and data binding, monitoring, and more.',
            'Not opinionated, you don\'t have to all-in: it\'s compatible with CRA, Babel/TypeScript, LESS/SASS, Apollo/Redux.',
        ],
    },
};

export class BenefitsBlock extends React.Component<{}, BenefitsBlockState> {
    state: BenefitsBlockState = {
        reason: 'BattleTestedSolution',
    };

    handleChangeReason = (reason: any) => {
        this.setState({
            reason: reason,
        });
        svc.uuiAnalytics.sendEvent(analyticsEvents.welcome.whyToUse(reason));
    }

    render() {
        return (
            <div className={ css.layout } >
                <FlexRow cx={ css.benefits } borderBottom >
                    <div className={ css.wrapper } >
                        <Text font='museo-sans' cx={ css.header } >Why to Use</Text>
                        <div className={ css.content } >
                            <div className={ css.actionsWrapper }>
                                <div className={ css.actionsContainer }>
                                    {
                                        Object.keys(benefits).map((reason: any) => {
                                            return <div key={ reason } onClick={ () => this.handleChangeReason(reason) } className={ cx(css.reason, this.state.reason === reason && css.reasonActive) }>
                                                <Text cx={ css.reasonCaption } font='museo-sans' color={ this.state.reason === reason ? 'gray80' : 'gray60' } fontSize='24' lineHeight='30' >{ benefits[reason].caption }</Text>
                                            </div>;
                                        })
                                    }
                                </div>
                            </div>
                            <div>
                                {
                                    benefits[this.state.reason].points.map((point: any, index: number) => <Text key={ index } font='sans' fontSize='24' cx={ css.point } >{ point }</Text>)
                                }
                            </div>
                        </div>
                    </div>
                </FlexRow>
            </div>
        );
    }
}