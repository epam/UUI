export const HEADER_PLUGIN_KEY = 'heading';

export const HEADER_TYPE_H1 = 'uui-richTextEditor-header-1';
export const HEADER_TYPE_H2 = 'uui-richTextEditor-header-2';
export const HEADER_TYPE_H3 = 'uui-richTextEditor-header-3';
export const HEADER_TYPE_H4 = 'uui-richTextEditor-header-4';
export const HEADER_TYPE_H5 = 'uui-richTextEditor-header-5';
export const HEADER_TYPE_H6 = 'uui-richTextEditor-header-6';

export type HeaderType = keyof typeof HEADER_MAP;

export const defaultHeaders: HeaderType[] = [HEADER_TYPE_H1, HEADER_TYPE_H2, HEADER_TYPE_H3];

export const HEADER_MAP = {
    [HEADER_TYPE_H1]: 'H1',
    [HEADER_TYPE_H2]: 'H2',
    [HEADER_TYPE_H3]: 'H3',
    [HEADER_TYPE_H4]: 'H4',
    [HEADER_TYPE_H5]: 'H5',
    [HEADER_TYPE_H6]: 'H6',
};
