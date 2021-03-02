import * as React from 'react';
import { DemoComponentProps } from '@epam/uui-docs';
import { ButtonProps } from '@epam/uui-components';
import { Panel, FlexRow, TabButtonMods, FlexSpacer, FlexCell } from '../../components';
import * as css from './TabButtonContext.scss';

export class TabButtonContext extends React.Component<DemoComponentProps<ButtonProps & TabButtonMods>, any> {
    public static displayName = "TabButtonContext";

    state = {
        activeTab: '',
    };

    setTab(tab: string, onClick?: () => void) {
        this.setState({ activeTab: tab });
        onClick && onClick();
    }

    render() {
        const { DemoComponent, props } = this.props;
        return (
            <Panel cx={ css.container } margin='24' style={ { padding: '6px', background: props.theme === 'dark' ? '#21232e' : undefined } }>
                <FlexCell width='auto' >
                    <FlexRow borderBottom={ props.theme === 'dark' ? 'night700' : 'night400' } background='none' size='36' spacing={ null }>
                        <DemoComponent
                            caption={ 'Main' }
                            onClick={ () => this.setTab('Main', props.onClick) }
                            size={ props.size }
                            theme={ props.theme }
                        />
                        <DemoComponent
                            { ...props }
                            caption={ props.caption }
                            onClick={ () => this.setTab('demoTab', props.onClick) }
                            size={ props.size }
                            theme={ props.theme }
                        />
                        <DemoComponent
                            caption={ 'Tools' }
                            onClick={ () => this.setTab('Tools', props.onClick) }
                            size={ props.size }
                            theme={ props.theme }
                        />
                        <DemoComponent
                            caption={ 'Options' }
                            onClick={ () => this.setTab('Options', props.onClick) }
                            size={ props.size }
                            theme={ props.theme }
                        />
                    </FlexRow>
                </FlexCell>
            </Panel>
        );
    }
}