import * as React from 'react';
import { RenderBlockProps } from "slate-react";
import * as css from './Separator.scss';
import { uuiMod, cx } from "@epam/uui";

export class Separator extends React.Component<RenderBlockProps> {

    render() {
        return <div { ...this.props.attributes } className={ cx(css.separator, this.props.isFocused && uuiMod.focus) }/>;
    }
}
