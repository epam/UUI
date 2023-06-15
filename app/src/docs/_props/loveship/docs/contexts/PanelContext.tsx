import * as React from 'react';
import { DemoComponentProps } from '@epam/uui-docs';
import { Panel, FlexRow } from '@epam/loveship';
import css from './PanelContext.module.scss';

export class PanelContext extends React.Component<DemoComponentProps> {
    public static displayName = 'Panel';
    render() {
        const { DemoComponent, props } = this.props;
        return (
            <Panel cx={ css.container } margin="24">
                <Panel background="white" cx={ css.demo }>
                    <FlexRow padding="12" vPadding="12" size="36">
                        <DemoComponent { ...props } />
                    </FlexRow>
                </Panel>
            </Panel>
        );
    }
}
