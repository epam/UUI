import { convertFromHTML as draftConvertFromHTML, convertToHTML as draftConvertToHTML } from 'draft-convert';
import { ContentBlock, ContentState, convertToRaw, EditorState, RawDraftEntity, SelectionState } from 'draft-js';
import getContentStateFragment from 'draft-js/lib/getContentStateFragment.js';
import * as React from 'react';
import { Link } from '../decorators';

export const colorStyle: { [key: string]: string } = {
    sky: '#30B6DD',
    grass: '#9BC837',
    carbon: '#5B5A59',
    night:'#525462',
    cobalt: '#577CE6',
    lavanda: '#8A7CBB',
    fuchsia: '#CD5485',
    fire: '#FF4E33',
    sun: '#FFA21D',
};

export function getSelectionText(contentState: ContentState, selectionState: SelectionState): string {
    const delimiter = '\n';
    const fragment = getContentStateFragment(contentState, selectionState);
    return fragment.map((block: ContentBlock) => block.getText()).join(delimiter);
}

export function contentStateToJson(contentState: ContentState) {
    return JSON.stringify(convertToRaw(contentState));
}

export function convertDraftStateToHtml(contentState: ContentState): string {
    const resultHTML = draftConvertToHTML({
        blockToHTML: (block: any) => {
            if ((block.type === 'paragraph' || block.type === 'unstyled') && block.text === '') {
                return <p>&nbsp;</p>;
            }
            if (block.type === 'atomic') {
                return { element: <figure>&nbsp;</figure> };
            }
        },
        entityToHTML: (entity: RawDraftEntity, text: string) => {
            if (entity.type === 'LINK') {
                return <Link data={ entity.data }>{ entity.data.displayText }</Link>;
            }
            if (entity.type === 'IMAGE') {
                return  <img src={ entity.data.src } alt={ entity.data.alt } width={ "100%" }/>;
            }
            return text;
        },
        styleToHTML: (style: string) => {
            if (!!colorStyle[style]) {
                return <span style={ { color: colorStyle[style] } } />;
            }
        },
    })(contentState);

    if (resultHTML === '<p>\u00A0</p>') {
        return '';
    } else {
        return resultHTML;
    }
}

export function convertHtmlToDraftState(html: string): ContentState {
    return draftConvertFromHTML({
        htmlToEntity: (nodeName: string, node: any, createEntity: (type: string, mutability: string, data: object) => string) => {
            if (nodeName === 'a') {
                return createEntity(
                    'LINK',
                    'IMMUTABLE',
                    { displayText: node.innerText, href: node.href },
                );
            }
            if (nodeName === 'img') {
                return createEntity(
                    'IMAGE',
                    'IMMUTABLE',
                    { alt: node.alt, src: node.src, width: node.width, height: node.height },
                );
            }
        },
        htmlToBlock: (nodeName: string, node: any) => {
            if (nodeName === 'figure') {
                return 'atomic';
            }
        },
        htmlToStyle: (nodeName: string, node: any, currentStyle: any) => {
            if (nodeName === 'span' && node.style.color) {
                const color = rgbToHex(node.style.color);
                return currentStyle.add(getColorStyleByValue(color));
            } else {
                return currentStyle;
            }
        },

    })(html);
}

export function getColorStyleByValue(value: string) {
    for (const key in colorStyle) {
        if (colorStyle[key] === value) {
            return key;
        }
    }
    return null;
}

export function rgbToHex(value: string) {
    const reg = /[0-9A-Fa-f]{6}/g;

    if (reg.test(value)) {
        return value;
    }

    const rgb = value.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
    ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}

export function blockTypeIsActive(editorState: EditorState, blockType: string | string[]): boolean {
    if (!editorState) {
        return false;
    }

    const type = editorState
        .getCurrentContent()
        .getBlockForKey(editorState.getSelection().getStartKey())
        .getType();

    if (Array.isArray(blockType)) {
        return blockType.indexOf(type) >= 0;
    } else {
        return type === blockType;
    }
}

export function getEntityRange(editorState: EditorState): { startOffset: number, endOffset: number } {
    const selection = editorState.getSelection();

    if (!selection.isCollapsed()) {
        return null;
    }

    const startKey = selection.getStartKey();
    const startOffset = selection.getStartOffset();
    const prevOffset = startOffset;
    const block = editorState.getCurrentContent().getBlockForKey(startKey);
    const characterList = block.getCharacterList();
    const prevChar = characterList.get(prevOffset);
    const nextChar = characterList.get(startOffset);

    if (!prevChar || !nextChar) {
        return null;
    }

    const prevEntity = prevChar.getEntity();
    const nextEntity = nextChar.getEntity();
    const entity = prevEntity === nextEntity && prevEntity;

    if (!entity) {
        return null;
    }

    let finalPrevOffset = prevOffset;
    let finalNextOffset = startOffset;

    while (finalPrevOffset > 0) {
        finalPrevOffset--;
        const char = characterList.get(finalPrevOffset);
        if (!char || char.getEntity() !== entity) {
            finalPrevOffset++;
            break;
        }
    }

    const blockLength = block.getLength();
    while (finalNextOffset < blockLength) {
        finalNextOffset++;
        const char = characterList.get(finalNextOffset);
        if (!char || char.getEntity() !== entity) {
            break;
        }
    }

    return { startOffset: finalPrevOffset, endOffset: finalNextOffset };
}
