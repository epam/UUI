import { Value, setNodes, PlateEditor, TNodeEntry } from '@udecode/plate-common';
import { TLinkElement } from '@udecode/plate-link';
import { TTableCellElement, TTableElement } from '@udecode/plate-table';
import { TAttachmentElement } from '../plugins/attachmentPlugin/types';
import { TIframeElement } from '../plugins/iframePlugin/types';
import { TImageElement } from '../plugins/imagePlugin/types';
import { toNewAlign } from './legacy_migrations';
import { DepreactedTTableElement, DeprecatedImageElement, DeprecatedTAttachmentElement, DeprecatedTIframeElement, DeprecatedTLinkElement, DeprecatedTTableCellElement } from './types';

/**
 * Migration property functions
 * Currently, depreate intercepting and redundant slate properties
 * Could be used mogarte to new as plate or custom element properties
 */

/** deprecate data properties */
export const normalizeTableCellElement = (editor: PlateEditor<Value>, entry: TNodeEntry) => {
    const [node, path] = entry;
    const tableCellNode = node as DeprecatedTTableCellElement;

    if (tableCellNode.data) {
        const { colSpan, rowSpan, ...otherData } = tableCellNode.data;

        if (!colSpan && !rowSpan) {
            return;
        }

        const cellNode: TTableCellElement = { ...tableCellNode, data: { ...otherData } };

        setNodes(
            editor,
            cellNode,
            { at: path },
        );
    }
};

/** Migrate data.cellSizes to the colSizes */
export const normalizeTableElement = (entry: TNodeEntry): TTableElement => {
    const [node] = entry;
    const tableNode = node as DepreactedTTableElement;

    if (tableNode.data) {
        const { cellSizes, ...otherData } = tableNode.data;

        // removing props
        if (!cellSizes) {
            return tableNode;
        }

        return { ...tableNode, colSizes: cellSizes, data: { ...otherData } };
    }
    return tableNode;
};

/** deprecate intercepting properties */
export const normalizeImageElement = (editor: PlateEditor<Value>, entry: TNodeEntry): TImageElement => {
    const [node] = entry;
    const imageNode = node as DeprecatedImageElement;

    // migrations
    if (imageNode.data) {
        const { align, imageSize, src, ...otherData } = imageNode.data;

        // removing props
        if (!align || !imageSize || !src) {
            return imageNode;
        }

        // align where setted to data after update to plate, so we need to fix that historical mistake
        const alignPayload = !!imageNode.align && !!align ? { align: toNewAlign(align) } : {};
        const widthPayload = imageSize?.width ? { width: imageSize.width } : {};
        const heightPayload = imageSize?.height ? { height: imageSize.height } : {};

        const imageElement: TImageElement = {
            ...imageNode,
            ...alignPayload,
            ...widthPayload,
            ...heightPayload,
            data: { ...otherData },
        };

        return imageElement;
    }

    return imageNode;
};

/** deprecate data properties */
export const normalizeLinkElement = (editor: PlateEditor<Value>, entry: TNodeEntry) => {
    const [node, path] = entry;
    const linkNode = node as DeprecatedTLinkElement;

    if (linkNode.data) {
        const { url, ...otherData } = linkNode.data;

        // removing props
        if (!url) {
            return;
        }

        const link: TLinkElement = { ...linkNode, data: { ...otherData } };

        setNodes(
            editor,
            link,
            { at: path },
        );
    }
};

/** deprecate data properties */
export const normalizeIframeElement = (editor: PlateEditor<Value>, entry: TNodeEntry) => {
    const [node, path] = entry;
    const iframeNode = node as DeprecatedTIframeElement;

    if (iframeNode.data) {
        const { src, ...otherData } = iframeNode.data;

        // removing props
        if (!src) {
            return;
        }

        const iframe: TIframeElement = { ...iframeNode, data: { ...otherData } };

        setNodes<TTableCellElement>(
            editor,
            iframe,
            { at: path },
        );
    }
};

/** deprecate data properties */
export const normalizeAttachmentElement = (editor: PlateEditor<Value>, entry: TNodeEntry) => {
    const [node, path] = entry;
    const attachment = node as DeprecatedTAttachmentElement;

    if (attachment.data) {
        const { src, ...otherData } = attachment.data;

        // removing props
        if (!src) {
            return;
        }

        const tableAttach: TAttachmentElement = { ...attachment, data: { ...otherData } };

        // path shouldn't be removed from data
        setNodes<TTableCellElement>(
            editor,
            tableAttach,
            { at: path },
        );
    }
};

const WORD_TO_COLOR = {
    critical: 'var(--uui-text-critical)',
    warning: 'var(--uui-text-warning)',
    success: 'var(--uui-text-success)',
};

/** deprecate color describe words */
export const normaizeColoredText = (editor: PlateEditor<Value>, entry: TNodeEntry) => {
    const [node, path] = entry;

    if (node.color === 'warning' || node.color === 'critical' || node.color === 'success') {
        setNodes<TTableCellElement>(
            editor,
            { ...node, color: WORD_TO_COLOR[node.color] },
            { at: path },
        );
    }
};
