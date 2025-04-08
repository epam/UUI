import React, { useMemo, useState } from 'react';
import { Checkbox, FlexRow, FlexSpacer, IconContainer, RichTextView, Text, Tooltip } from '@epam/uui';
import { TDocsGenExportedType } from '@epam/uui-docs';
import { useDocsGenForType, useDocsGenSummaries } from './dataHooks';
import { TType } from '@epam/uui-docs';
import css from './TypeRefSection.module.scss';
import { ReactComponent as InfoIcon } from '@epam/assets/icons/common/notification-info-outline-18.svg';
import { TypeRefTable } from './TypeRefTable';

interface TypeRefSectionProps {
    showCode?: boolean;
    typeRef: TDocsGenExportedType;
}
export function TypeRefSection(props: TypeRefSectionProps) {
    const docsGenType = useDocsGenForType(props.typeRef);
    const docsGenSummaries = useDocsGenSummaries();
    const { canGroup, isGrouped, setIsGrouped } = useIsGrouped(docsGenType);

    const propsFromUnion = docsGenType?.details?.propsFromUnion;
    const hasToolbar = canGroup || propsFromUnion;

    const renderGroupBy = () => {
        if (canGroup) {
            return <Checkbox value={ isGrouped } onValueChange={ setIsGrouped } label="Show interfaces" />;
        }
    };
    const renderPropsInfo = () => {
        if (propsFromUnion) {
            const renderContent = () => {
                const html = `
                        <h5>This type uses unions</h5>
                        <p>
                            The table may contain same props with same or different types.
                            Please see the source code to better understand exact typing.
                        </p>
                `;
                return (
                    <RichTextView htmlContent={ html } />
                );
            };
            return (
                <>
                    <Text>Union</Text>
                    <Tooltip renderContent={ renderContent } color="neutral">
                        <IconContainer
                            icon={ InfoIcon }
                            style={ { fill: '#008ACE', marginLeft: '5px' } }
                        />
                    </Tooltip>
                </>
            );
        }
    };
    const renderToolbar = () => {
        if (hasToolbar) {
            return (
                <FlexRow>
                    { renderGroupBy() }
                    <FlexSpacer />
                    { renderPropsInfo() }
                </FlexRow>
            );
        }
    };

    const isNoData = !docsGenType?.details?.props?.length;

    if (isNoData || !docsGenSummaries) {
        return null;
    }

    return (
        <div className={ css.root }>
            { renderToolbar() }
            <TypeRefTable docsGenSummaries={ docsGenSummaries } docsGenType={ docsGenType } isGrouped={ isGrouped } />
            {/* <CodeExpandable showCode={ props.showCode } docsGenType={ docsGenType } /> */}
        </div>
    );
}

function useIsGrouped(docsGenType?: TType): { canGroup: boolean, setIsGrouped: (isGrouped: boolean) => void, isGrouped: boolean } {
    const [isGrouped, setIsGrouped] = useState(false);
    const canGroup = useMemo(() => {
        if (docsGenType) {
            return Boolean(docsGenType.details?.props?.some(({ from }) => !!from));
        }
        return false;
    }, [docsGenType]);

    return {
        canGroup,
        isGrouped: Boolean(canGroup && isGrouped),
        setIsGrouped,
    };
}
