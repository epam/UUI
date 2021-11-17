import * as React from 'react';
import * as css from './FlexRow.scss';
import { FlexRowProps, uuiMarkers, isClickableChildClicked, cx } from '@epam/uui';

export class FlexRow extends React.Component<FlexRowProps> {

    handleClick = (e: React.SyntheticEvent<HTMLDivElement>) => !isClickableChildClicked(e) && this.props?.onClick ? this.props.onClick(e) : undefined;

    render() {
        return (
            <div
                onClick={ this.props.onClick ? this.handleClick : undefined }
                className={ cx(
                    this.props.cx,
                    css.container,
                    this.props.onClick && uuiMarkers.clickable,
                    css['align-items-' + (this.props.alignItems === undefined ? 'center' : this.props.alignItems)],
                ) }
                { ...this.props.rawProps }
                style={ { ...this.props.rawProps?.style } }
            >
                { this.props.children }
            </div>
        );
    }
}