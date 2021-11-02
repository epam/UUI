import * as React from 'react';
import { RenderBlockProps } from "slate-react";
import * as css from './NotePluginBlock.scss';
import cx from 'classnames';

export interface NotePluginBlockProps extends RenderBlockProps {
    type?: 'warning' | 'error' | 'link' | 'quote';
}

export class NotePluginBlock extends React.Component<NotePluginBlockProps> {

    render() {
        const { attributes } = this.props;

        return <div { ...attributes } className={ cx(css.wrapper, css[this.props.type]) }>
            <div className={ css.content }>
                { this.props.children }
            </div>
        </div>;
    }
}
