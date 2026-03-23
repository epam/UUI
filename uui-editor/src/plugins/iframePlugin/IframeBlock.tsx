import * as React from 'react';
import css from './iframeBlock.module.scss';
import { uuiMod } from '@epam/uui-core';
import cx from 'classnames';
import { sanitizeUrl } from '@braintree/sanitize-url';
import { useSelected } from 'slate-react';
import { PlateElement, PlateElementProps, useElement } from '@udecode/plate-common';
import { TIframeElement } from './types';

const IFRAME_GLOBAL_CLASS = 'uui-rte-iframe';
const PDF_GLOBAL_CLASS = 'uui-rte-iframe-pdf';

export const IframeBlock = function IframeComp({ children, ...props }: PlateElementProps) {
    const element = useElement<TIframeElement>();
    const isSelected = useSelected();

    const isPdf = element.data?.extension === 'pdf';
    const style = element.data?.style;

    const url: string = element.url || element.src as string; // element.src it's previous editor format structure

    return (
        <PlateElement as="div" { ...props }>
            <iframe
                title={ url }
                allowFullScreen={ true }
                src={ sanitizeUrl(url) }
                style={ style }
                className={ cx(css.content, isSelected && uuiMod.focus, IFRAME_GLOBAL_CLASS, isPdf && PDF_GLOBAL_CLASS) }
            />
            { children }
        </PlateElement>
    );
};
