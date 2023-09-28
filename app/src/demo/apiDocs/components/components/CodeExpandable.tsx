import React, { useState } from 'react';
import css from './CodeExpandable.module.scss';
import { FlexRow, LinkButton, Switch } from '@epam/uui';
import { FlexSpacer } from '@epam/uui-components';
import { Code } from '../../../../common/docs/Code';
import { TType } from '../../docsGenSharedTypes';
import { useTsDocsRefs } from '../../dataHooks';

function buildGitURL(relativePath?: string) {
    if (relativePath) {
        return `https://github.com/epam/UUI/blob/main/${relativePath}`;
    }
}

export function CodeExpandable(props: { showCode: boolean; tsDocsType: TType }) {
    const { showCode, tsDocsType } = props;
    const [isCodeExpanded, setIsCodeExpanded] = useState<boolean>(false);
    const tsDocsRefs = useTsDocsRefs();
    if (!tsDocsType) {
        // not loaded yet
        return null;
    }
    if (!showCode) {
        return null;
    }
    const relativeUrl = tsDocsRefs[tsDocsType.typeRef].src;
    const gitUrl = buildGitURL(relativeUrl);
    return (
        <div className={ css.root }>
            <FlexRow size="36" padding="12" spacing="6" borderBottom={ isCodeExpanded }>
                <Switch label="View Code" value={ isCodeExpanded } onValueChange={ () => setIsCodeExpanded((prev) => !prev) } />
                <FlexSpacer />
                <LinkButton href={ gitUrl } target="_blank" caption={ relativeUrl } />
            </FlexRow>
            {isCodeExpanded && (
                <FlexRow key="code" size="36" padding="12">
                    <Code codeAsHtml={ tsDocsType?.typeValue.print?.join('\n') || '' } />
                </FlexRow>
            )}
        </div>
    );
}
