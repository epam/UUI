import { TDescendant, Value } from '@udecode/plate-common';
import { ATTACHMENT_TYPE } from '../plugins/attachmentPlugin/constants';
import { IFRAME_TYPE } from '../plugins/iframePlugin/constants';
import { IMAGE_TYPE } from '../plugins/imagePlugin/constants';
import { TImageElement } from '../plugins/imagePlugin/types';
import { LINK_TYPE } from '../plugins/linkPlugin/constants';
import { PARAGRAPH_TYPE } from '../plugins/paragraphPlugin';
import { TABLE_CELL_TYPE, TABLE_HEADER_CELL_TYPE, TABLE_ROW_TYPE, TABLE_TYPE } from '../plugins/tablePlugin/constants';
import { SlateBlockElement, SlateElement, SlateImgAlign, SlateInlineElement, SlateMark, SlateSchema, SlateTextElement } from './types';

const mediaTypes = [IMAGE_TYPE, IFRAME_TYPE];
const cellTypes = [TABLE_CELL_TYPE, TABLE_HEADER_CELL_TYPE];
const createPlateEmptyTextNode = () => ({ text: '' });

const migrateTextNode = (oldNode: SlateTextElement) => {
    const marksPayload = (oldNode.marks || []).reduce<SlateMark>((acc, mark) => {
        return {
            ...acc,

            /** for historical reasons */
            /** some projects may still use that properties, but we don't */
            ...(mark.data?.style || {}),
            [mark.type]: true,
        };
    }, {} as SlateMark);

    return { text: oldNode.text, ...marksPayload };
};

const getTablePayload = (node: SlateElement) => {
    if (node.type !== TABLE_TYPE) return {};

    const { cellSizes, ...otherData } = node.data || {};
    if (!!cellSizes) {
        const pyaload = { colSizes: [...cellSizes], data: { ...otherData } };
        return pyaload;
    }

    return {};
};

const getTableRowPayload = (node: SlateElement): { children: TDescendant[] } => {
    const cellNodes = (node.nodes || []).reduce((acc: SlateElement[], cell: SlateElement) => {
        /** skip merged cells with new approach */
        if (cell.data?.style !== 'none') {
            acc.push(cell);
        }
        return acc;
    }, []);

    if (!!cellNodes.length) {
        return { children: migrate(cellNodes) };
    }

    /** element should contain at least one text node in case of all cells merged */
    return { children: [createPlateEmptyTextNode()] };
};

const getTableCellElementPayload = (node: SlateElement) => {
    if (!cellTypes.includes(node.type || '')) return {};

    const { colSpan, rowSpan, ...otherData } = node.data || {};
    const colSpanPayload = colSpan ? { colSpan } : {};
    const rowSpanPayload = rowSpan ? { rowSpan } : {};

    return { ...colSpanPayload, ...rowSpanPayload, data: { ...otherData } };
};

const getLinkPayload = (node: SlateElement) => {
    if (node.type !== LINK_TYPE) return {};

    const { url, ...otherData } = node.data || {};
    return url ? { url, data: { ...otherData } } : {};
};

const getAttachmentPayload = (node: SlateElement) => {
    if (node.type !== ATTACHMENT_TYPE) return {};

    const { src, ...otherData } = node.data || {};
    // path shouldn't be removed from data
    return src ? { url: src || node.data?.path, data: { ...otherData } } : {};
};

/** iframes and images */
const getMediaTypesPayload = (node: SlateElement) => {
    if (!mediaTypes.includes(node.type || '')) return {};

    const { src, align, imageSize, ...other } = node.data || {};

    // path shouldn't be removed from data
    const urlPayload = src ? { url: src || node.data?.path } : {};

    // only image related
    const alignPayload = align ? { align: toNewAlign(align) } : {};
    const widthPayload = imageSize?.width ? { width: imageSize.width } : {};
    const heightPayload = imageSize?.height ? { height: imageSize.height } : {};

    return {
        ...urlPayload,
        ...alignPayload,
        ...widthPayload,
        ...heightPayload,
        data: { ...other },
    };
};

const isTable = (node: SlateElement): boolean => {
    return node.type === PARAGRAPH_TYPE && node.nodes?.[0]?.type === TABLE_TYPE;
};

const migrateDeeper = (_node: SlateBlockElement | SlateInlineElement): TDescendant => {
    /** table was nested inside paragraph node historically */
    const node = isTable(_node) ? _node.nodes![0] as SlateBlockElement : _node;

    let childrenPayload;
    if (node.type === TABLE_ROW_TYPE) {
        childrenPayload = getTableRowPayload(node);
    } else {
        childrenPayload = { children: node.nodes ? migrate(node.nodes) : [createPlateEmptyTextNode()] };
    }
    const dataPayload = node.data ? { data: node.data } : {};

    /** omits deprecated properties and leaves data anyway */
    /** there might be duplications with data, but we could also omit them with versioned apprach via plate normalizeNode */
    return {
        type: node.type,
        ...dataPayload,
        ...getTablePayload(node),
        ...getTableCellElementPayload(node),
        ...getLinkPayload(node),
        ...getMediaTypesPayload(node),
        ...getAttachmentPayload(node),
        ...childrenPayload,
    };
};

const migrate = (descendants: SlateElement[]): TDescendant[] =>
    descendants.map((node) => {
        if (node.object !== 'text') {
            /** 'inline' and 'block' nodes passed here, other considered and skipped */
            return migrateDeeper(node);
        }

        return migrateTextNode(node);
    });

export const migrateLegacySchema = (schema: SlateSchema): Value => {
    try {
        return migrate(schema.document.nodes) as Value;
    } catch (e) {
        console.error("Can't migrate schema", e);
    }

    // in case of error
    return schema as unknown as Value;
};

const LEGACY_TO_NEW_IMG_ALIGN = {
    'align-left': 'left',
    'align-right': 'right',
    'align-center': 'center',
};

/** converts align property */
export const toNewAlign = (slateAlign: SlateImgAlign): TImageElement['align'] =>
    LEGACY_TO_NEW_IMG_ALIGN[slateAlign] as TImageElement['align'];
