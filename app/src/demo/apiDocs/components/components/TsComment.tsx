import React, { useMemo } from 'react';
import { RichTextView } from '@epam/promo';
import css from './TsComment.module.scss';

function formatComment(commentInput: string) {
    // Playground to modify and debug https://regex101.com/r/dd4hyi/1
    const linksRegex = /(?:\[(.*)])?\{\s*@link\s*(https:\/\/\S+?)\s*}/gm;
    let comment = commentInput;
    comment = comment.replace(linksRegex, (_, a, b) => `<a href='${b}'>${a ?? b}</a>`);
    return comment;
}

function escapeArr(htmlStr: string[]) {
    return htmlStr.map(escapeLine);
}
function escapeLine(htmlStr: string) {
    return htmlStr.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function TsComment(props: { text?: string[], keepBreaks: boolean, isCompact?: boolean }) {
    const { text, keepBreaks, isCompact } = props;

    const textStr = useMemo(() => {
        if (text && text.length > 0) {
            if (keepBreaks) {
                return `<p>${formatComment(escapeArr(text).join('<br />'))}</p>`;
            }
            return `<p>${formatComment(escapeLine(text.join(' ')))}</p>`;
        }
    }, [text, keepBreaks]);

    if (!textStr) {
        return null;
    }
    return <RichTextView htmlContent={ textStr } size="16" cx={ [css.root, isCompact && css.compact] } />;
}
