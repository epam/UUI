import React, { useState } from 'react';
import css from './CodeExpandable.module.scss';
import { FlexRow, LinkButton, Switch, Text } from '@epam/uui';
import { FlexSpacer } from '@epam/uui-components';
import { Code } from '../../../../common/docs/Code';
import { TTypeRefShort } from '../../docsGenSharedTypes';
import { useTsDocs } from '../../dataHooks';

function buildGitURL(relativePath?: string) {
    if (relativePath) {
        return `https://github.com/epam/UUI/blob/main/${relativePath}`;
    }
}

export function CodeExpandable(props: { showCode: boolean; typeRefShort: TTypeRefShort }) {
    const { showCode, typeRefShort } = props;
    const [isCodeExpanded, setIsCodeExpanded] = useState<boolean>(false);
    const tsDocs = useTsDocs();
    if (!tsDocs) {
        // not loaded yet
        return null;
    }
    const exportInfo = tsDocs.get(typeRefShort);
    const typeRefLong = tsDocs.getTypeRef(typeRefShort);
    if (!showCode) {
        return null;
    }
    if (!exportInfo) {
        return <Text>{`Unable to find exported type: ${typeRefShort}`}</Text>;
    }
    const relativeUrl = typeRefLong.src;
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
                    <Code codeAsHtml={ exportInfo?.typeValue.print?.join('\n') || '' } />
                </FlexRow>
            )}
        </div>
    );
}
