import * as React from 'react';
import css from './DefaultContext.scss';
import { DemoComponentProps } from '@epam/uui-docs';
import { FlexCell } from '@epam/promo';

export class DefaultContext extends React.Component<DemoComponentProps> {
    public static displayName = 'Default';

    render() {
        const { DemoComponent, props } = this.props;

        return (
            <div className={css.root} style={{ background: props.theme == 'dark' && '#2c2f3c' }}>
                <FlexCell width="auto">
                    <DemoComponent {...props} />
                </FlexCell>
            </div>
        );
    }
}
