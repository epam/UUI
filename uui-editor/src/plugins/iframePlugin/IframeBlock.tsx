import * as React from 'react';
import { RenderBlockProps } from "slate-react";
import * as css from './iframeBlock.scss';
import { uuiMod } from "@epam/uui";
import cx from 'classnames';
import { sanitizeUrl } from '@braintree/sanitize-url';

const IFRAME_GLOBAL_CLASS = 'uui-rte-iframe';
const PDF_GLOBAL_CLASS = 'uui-rte-iframe-pdf';

export class IframeBlock extends React.Component<RenderBlockProps> {

    render() {
        const { attributes, node } = this.props;
        const src = node.data.get('src');
        const isPdf = node.data.get('extension') === 'pdf';
        const style = node.data.get('style');

        return (
            <iframe allowFullScreen={ true } { ...attributes } src={ sanitizeUrl(src) } style={ style }
                className={ cx(css.content, this.props.isFocused && uuiMod.focus, IFRAME_GLOBAL_CLASS, isPdf && PDF_GLOBAL_CLASS) }/>
        );
    }
}
