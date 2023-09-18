import React, { useState } from 'react';
import css from './CodeExpandable.module.scss';
import { FlexRow, Switch, Text } from '@epam/uui';
import { FlexSpacer } from '@epam/uui-components';
import { Code } from '../../../../common/docs/Code';
import { TType } from '../../types';

export function CodeExpandable(props: { showCode: boolean; exportInfo: TType }) {
    const { showCode, exportInfo } = props;
    const [isCodeExpanded, setIsCodeExpanded] = useState<boolean>();
    if (!showCode) {
        return null;
    }
    return (
        <div className={ css.root }>
            <FlexRow size="36" padding="12" spacing="6" borderBottom={ isCodeExpanded }>
                <Switch label="View Code" value={ isCodeExpanded } onValueChange={ () => setIsCodeExpanded((prev) => !prev) } />
                <FlexSpacer />
                <Text>{exportInfo.source}</Text>
            </FlexRow>
            {isCodeExpanded && (
                <FlexRow key="code" size="36" padding="12">
                    <Code codeAsHtml={ exportInfo?.typeValue.print?.join('\n') } />
                </FlexRow>
            )}
        </div>
    );
}
