import React from 'react';
import { TTypeRefShort } from '../../docsGenSharedTypes';
import { TsComment } from './TsComment';
import { useTsDocForType } from '../../dataHooks';

export function TsCommentForTypeRef(props: { typeRef: TTypeRefShort, keepBreaks: boolean, isCompact?: boolean }) {
    const tsDocsType = useTsDocForType(props.typeRef);
    const text = tsDocsType?.comment;
    if (!text?.length) {
        return null;
    }
    return (
        <TsComment keepBreaks={ props.keepBreaks } isCompact={ props.isCompact } text={ text } />
    );
}
