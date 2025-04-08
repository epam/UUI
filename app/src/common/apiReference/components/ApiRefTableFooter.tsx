import React from 'react';
import css from './CodeExpandable.module.scss';
import { FlexRow, LinkButton } from '@epam/uui';
import { FlexSpacer } from '@epam/uui-components';
import { TType } from '@epam/uui-docs';

function buildGitURL(relativePath?: string) {
    if (relativePath) {
        return `https://github.com/epam/UUI/blob/main/${relativePath}`;
    }
}

export function ApiRefTableFooter(props: { docsGenType: TType }) {
    const { docsGenType } = props;
    if (!docsGenType) {
        // not loaded yet
        return null;
    }
    const relativeUrl = docsGenType.summary.src;
    const gitUrl = buildGitURL(relativeUrl);
    return (
        <div className={ css.root }>
            <FlexRow size="36" padding="12" columnGap="6">
                <FlexSpacer />
                <LinkButton href={ gitUrl } target="_blank" caption={ relativeUrl } />
            </FlexRow>
        </div>
    );
}
