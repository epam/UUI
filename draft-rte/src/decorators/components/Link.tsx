import * as React from 'react';
import { DecoratorComponentProps } from '../../types';

export class Link extends React.Component<DecoratorComponentProps> {

    render() {
        const data: Record<string, string> = this.props.data ? this.props.data : this.props.contentState.getEntity(this.props.entityKey).getData();

        return <a href={ data.href } target='_blank'>{ this.props.children ? this.props.children : this.props.data.displayText }</a>;
    }
}