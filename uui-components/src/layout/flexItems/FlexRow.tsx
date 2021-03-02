import * as React from 'react';
import * as css from './FlexRow.scss';
import cx from 'classnames';
import { FlexRowProps, uuiMarkers, isClickableChildClicked } from '@epam/uui';

export class FlexRow extends React.Component<FlexRowProps> {

    handleClick = (e: React.SyntheticEvent<HTMLDivElement>) => !isClickableChildClicked(e) && this.props.onClick ? this.props.onClick(e) : undefined;

    render() {
        const props = {
            onClick: this.props.onClick ? this.handleClick : undefined,
            ...this.props.rawProps,
        };

        return <div
            className={ cx(
                this.props.cx,
                css.container,
                props.onClick && uuiMarkers.clickable,
                css['align-items-' + (this.props.alignItems === undefined ? 'center' : this.props.alignItems)],
            ) }
            { ...props }
        >
            { this.props.children }
        </div>;
    }
}