/**
 * Modified types for UUI editor format specifically
 */

import {
    BOLD_KEY, CODE_BLOCK_KEY, IMAGE_PLUGIN_TYPE, ITALIC_KEY, LINK_ELEMENT, PARAGRAPH_TYPE, QUOTE_PLUGIN_KEY, SEPARATOR_KEY,
} from '../plugins';
import {
    ELEMENT_UL_CUSTOM, ELEMENT_OL_CUSTOM, ELEMENT_LI_CUSTOM,
} from '../plugins/listPlugin/constants';

export interface NodeTypes {
    paragraph: string;
    block_quote: string;
    link: string;
    ul_list: string;
    ol_list: string;
    listItem: string;
    heading: {
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
        6: string;
    };
    emphasis_mark: string;
    strong_mark: string;
    inline_code_mark: string;
    thematic_break: string;
    image: string;
    code_block?: string;
    delete_mark?: string;
}

export interface LeafType {
    text: string;
    strikeThrough?: boolean;
    parentType?: string;
    ['uui-richTextEditor-bold']?: boolean;
    ['uui-richTextEditor-italic']?: boolean;
    ['uui-richTextEditor-code']?: boolean;
}

export interface BlockType {
    type: string;
    parentType?: string;
    url?: string;
    caption?: Array<BlockType | LeafType>;
    language?: string;
    break?: boolean;
    children: Array<BlockType | LeafType>;
}

export const remarkNodeTypesMap: NodeTypes = {
    paragraph: PARAGRAPH_TYPE,
    block_quote: QUOTE_PLUGIN_KEY,
    link: LINK_ELEMENT,
    ul_list: ELEMENT_UL_CUSTOM,
    ol_list: ELEMENT_OL_CUSTOM,
    listItem: ELEMENT_LI_CUSTOM,
    heading: {
        1: 'uui-richTextEditor-header-1',
        2: 'uui-richTextEditor-header-2',
        3: 'uui-richTextEditor-header-3',
        4: 'uui-richTextEditor-header-4',
        5: 'uui-richTextEditor-header-5',
        6: 'uui-richTextEditor-header-6',
    },
    emphasis_mark: ITALIC_KEY,
    strong_mark: BOLD_KEY,
    inline_code_mark: CODE_BLOCK_KEY,
    thematic_break: SEPARATOR_KEY,
    image: IMAGE_PLUGIN_TYPE,
    // code_block
    // delete_mark
};
