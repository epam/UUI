import {
    cleanHtmlBrElements,
    cleanHtmlFontElements,
    cleanHtmlLinkElements,
    cleanHtmlTextNodes,
    postCleanHtml,
    preCleanHtml,
} from '@udecode/plate-common';
import { cleanHtmlEmptyElements } from './cleanHtmlEmptyElements';
import {
    cleanDocxBrComments,
    cleanDocxEmptyParagraphs,
    cleanDocxFootnotes,
    cleanDocxImageElements,
    cleanDocxListElements,
    cleanDocxQuotes,
    cleanDocxSpans,
    isDocxContent,
} from '@udecode/plate-serializer-docx';

export const cleanDocx = (html: string, rtf: string): string => {
    const document = new DOMParser().parseFromString(
        preCleanHtml(html),
        'text/html',
    );
    const { body } = document;

    if (!rtf && !isDocxContent(body)) {
        return html;
    }

    cleanDocxFootnotes(body);
    cleanDocxImageElements(document, rtf, body);
    cleanHtmlEmptyElements(body);
    cleanDocxEmptyParagraphs(body);
    cleanDocxQuotes(body);
    cleanDocxSpans(body);
    cleanHtmlTextNodes(body);
    cleanDocxBrComments(body);
    cleanHtmlBrElements(body);
    cleanHtmlLinkElements(body);
    cleanHtmlFontElements(body);
    cleanDocxListElements(body);
    // TODO: Fix on plate
    // fixes bug with pasting table from word in Safari only
    // copyBlockMarksToSpanChild(body);

    return postCleanHtml(body.innerHTML);
};
