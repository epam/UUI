import * as React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import * as css from './Blocker.scss';
import { IHasCX } from '@epam/uui';
import cx from 'classnames';

// TBD: move to loveship-specific mods
//import { EpamColor, SpinnerMods } from '@epam/oswald';

export interface BlockerProps extends IHasCX {
    isEnabled: boolean;
    hideSpinner?: boolean;
    spacerHeight?: number;
    renderSpinner?(props: any): React.ReactNode; //React.ComponentClass<SpinnerMods>;
}

const uuiBlocker = {
    container: 'uui-blocker-container',
    blocker: 'uui-blocker',
    enter: 'uui-blocker-enter',
    enterActive: 'uui-blocker-enter-active',
    exit: 'uui-blocker-exit',
    exitActive: 'uui-blocker-exit-active',
};

export class Blocker extends React.Component<BlockerProps, any> {
    render() {

        return (
            <div className={ cx(css.container, uuiBlocker.container, this.props.cx) } style={ { minHeight: this.props.isEnabled && this.props.spacerHeight ? `${this.props.spacerHeight}px` : undefined } }>
                <TransitionGroup>
                    { this.props.isEnabled && <CSSTransition classNames={ uuiBlocker } timeout={ { enter: 2000, exit: 1000 } }>
                        <div className={ uuiBlocker.blocker }>
                            { !this.props.hideSpinner && this.props.renderSpinner && this.props.renderSpinner(this.props) }
                        </div>
                    </CSSTransition>
                    }
                </TransitionGroup>
            </div>
        );
    }
}