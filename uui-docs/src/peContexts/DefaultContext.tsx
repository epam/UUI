import * as React from 'react';
import { FlexCell } from '@epam/uui';
import { DemoComponentProps } from '../types';
import css from './DefaultContext.module.scss';
import cx from 'classnames';

export class DefaultContext extends React.Component<DemoComponentProps, any> {
    public static displayName = 'Default';
    render() {
        const { DemoComponent, props, isPreview } = this.props;

        return (
            <div className={ cx([css.root, isPreview && css.preview]) } style={ { background: props.theme === 'dark' && '#2c2f3c' } }>
                <FlexCell width="auto">
                    <DemoComponent { ...props } />
                </FlexCell>
            </div>
        );
    }
}
