import { ReactComponent as H1Icon } from '../../icons/heading-H1.svg';
import { ReactComponent as H2Icon } from '../../icons/heading-H2.svg';
import { ReactComponent as H3Icon } from '../../icons/heading-H3.svg';
import { ReactComponent as H4Icon } from '../../icons/heading-H4.svg';
import { ReactComponent as H5Icon } from '../../icons/heading-H5.svg';
import { ReactComponent as H6Icon } from '../../icons/heading-H6.svg';

export const HEADER_PLUGIN_KEY = 'heading';

export const HEADER_TYPE_H1 = 'uui-richTextEditor-header-1';
export const HEADER_TYPE_H2 = 'uui-richTextEditor-header-2';
export const HEADER_TYPE_H3 = 'uui-richTextEditor-header-3';
export const HEADER_TYPE_H4 = 'uui-richTextEditor-header-4';
export const HEADER_TYPE_H5 = 'uui-richTextEditor-header-5';
export const HEADER_TYPE_H6 = 'uui-richTextEditor-header-6';

const HEADER_H1 = 'header-1';
const HEADER_H2 = 'header-2';
const HEADER_H3 = 'header-3';
const HEADER_H4 = 'header-4';
const HEADER_H5 = 'header-5';
const HEADER_H6 = 'header-6';

/** map header to uui type */
export const HEADER_TO_TYPE = {
    [HEADER_H1]: HEADER_TYPE_H1,
    [HEADER_H2]: HEADER_TYPE_H2,
    [HEADER_H3]: HEADER_TYPE_H3,
    [HEADER_H4]: HEADER_TYPE_H4,
    [HEADER_H5]: HEADER_TYPE_H5,
    [HEADER_H6]: HEADER_TYPE_H6,
};

/** type of headers */
export type HeadersConfig = {
    headers?: HeaderType[];
};

export type HeaderType = keyof typeof HEADER_TO_TYPE;

export const defaultHeadersConig: HeadersConfig = { headers: [HEADER_H1, HEADER_H2, HEADER_H3] };

export const HEADER_TYPE_TO_ICON = {
    [HEADER_TYPE_H1]: H1Icon,
    [HEADER_TYPE_H2]: H2Icon,
    [HEADER_TYPE_H3]: H3Icon,
    [HEADER_TYPE_H4]: H4Icon,
    [HEADER_TYPE_H5]: H5Icon,
    [HEADER_TYPE_H6]: H6Icon,
};
