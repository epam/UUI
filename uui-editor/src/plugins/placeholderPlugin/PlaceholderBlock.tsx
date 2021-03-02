import * as React from 'react';
import { RenderInlineProps } from "slate-react";
import * as css from './PlaceholderPlugin.scss';
import cx from 'classnames';
import { uuiMod } from "@epam/uui";

export class PlaceholderBlock extends React.Component<RenderInlineProps> {

    render() {
        const { attributes, node } = this.props;
        const src = node.data.get('name');

        return <span { ...attributes } className={ cx(css.placeholderBlock, this.props.isFocused && uuiMod.focus) }>
            { src }
        </span>;
    }
}
