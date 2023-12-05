import React, { useMemo } from 'react';
import { RichTextView } from '@epam/promo';
import css from './TsComment.module.scss';
import { TComment } from '@epam/uui-docs';

function formatComment(commentInput: string) {
    // Playground to modify and debug https://regex101.com/r/dd4hyi/1
    const linksRegex = /(?:\[(.*)])?\{\s*@link\s*(https:\/\/\S+?)\s*}/gm;
    let comment = commentInput;
    comment = comment.replace(linksRegex, (_, a, b) => `<a href='${b}' class="${css.link}">${a ?? b}</a>`);
    return comment;
}

function escapeArr(htmlStr: string[]) {
    return htmlStr.map(escapeLineForHtml);
}
function escapeLineForHtml(htmlStr: string) {
    return htmlStr.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function TsComment(props: { comment?: TComment, keepBreaks: boolean, isCompact?: boolean }) {
    const { comment, keepBreaks, isCompact } = props;
    const text = comment?.raw;

    const textStr = useMemo(() => {
        if (text && text.length > 0) {
            if (keepBreaks) {
                return `<p>${formatComment(escapeArr(text).join('<br />'))}</p>`;
            }
            return `<p>${formatComment(escapeLineForHtml(text.join(' ')))}</p>`;
        }
    }, [text, keepBreaks]);

    if (!textStr) {
        return null;
    }
    return <RichTextView htmlContent={ textStr } size="16" cx={ [css.root, isCompact && css.compact] } />;
}
