import * as React from 'react';
import * as types from '@epam/uui';
import cx from 'classnames';
import { isClickableChildClicked } from '@epam/uui';

export class FlexCell extends React.Component<types.FlexCellProps> {

    handleClick = (e: React.SyntheticEvent<HTMLDivElement>) => !isClickableChildClicked(e) && this.props.onClick && this.props.onClick(e);

    render() {
        let width: string = '0';

        if (this.props.width) {
            if (this.props.width === 'auto' || this.props.width === '100%') {
                width = this.props.width;
            } else {
                width = this.props.width + 'px';
            }
        }

        const style = {
            minWidth: this.props.minWidth ? (this.props.minWidth + 'px') : 0,
            flexGrow: this.props.grow,
            flexShrink: this.props.shrink,
            flexBasis: width,
            textAlign: this.props.textAlign,
            alignSelf: this.props.alignSelf,
        };

        return (
            <div
                className={ cx(this.props.cx) }
                onClick={ this.handleClick }
                { ...this.props.rawProps }
                style={ { ...style, ...(this.props.rawProps && this.props.rawProps.style) } }
            >
                { this.props.children }
           </div>
        );
    }
}