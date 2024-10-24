import * as React from 'react';
import css from './iframeBlock.module.scss';
import { uuiMod } from '@epam/uui-core';
import cx from 'classnames';
import { sanitizeUrl } from '@braintree/sanitize-url';
import { useSelected } from 'slate-react';
import { AnyObject, PlatePluginComponent } from '@udecode/plate-common';
import { TIframeElement } from './types';

const IFRAME_GLOBAL_CLASS = 'uui-rte-iframe';
const PDF_GLOBAL_CLASS = 'uui-rte-iframe-pdf';

export const IframeBlock: PlatePluginComponent<{
    attributes: AnyObject,
    children: React.ReactNode,
    element: TIframeElement
}> = function IframeComp(props) {
    const { attributes, children, element } = props;
    const isSelected = useSelected();

    const isPdf = element.data?.extension === 'pdf';
    const style = element.data?.style;

    const url: string = element.url || element.src as string; // element.src it's previous editor format structure

    return (
        // style attr needed for serialization
        <div { ...attributes }>
            <iframe
                title={ url }
                allowFullScreen={ true }
                src={ sanitizeUrl(url) }
                style={ style }
                className={ cx(css.content, isSelected && uuiMod.focus, IFRAME_GLOBAL_CLASS, isPdf && PDF_GLOBAL_CLASS) }
            />
            { children }
        </div>
    );
};
