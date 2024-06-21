import * as React from 'react';
import { DemoComponentProps } from '../types';

export class BlockContext extends React.Component<DemoComponentProps, any> {
    public static displayName = 'Block';
    render() {
        const { DemoComponent, props } = this.props;
        const whiteElementBackground = 'var(--uui-info-60)';
        const bg = props?.color === 'white' && whiteElementBackground;

        return (
            <div style={ { background: bg, padding: '4px' } }>
                <DemoComponent { ...props } />
            </div>
        );
    }
}
