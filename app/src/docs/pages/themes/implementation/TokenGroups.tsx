import React, { useEffect, useRef, useState } from 'react';
import { Blocker, FlexCell, FlexRow, FlexSpacer, Panel, RichTextView, SuccessNotification, Text, Tooltip } from '@epam/uui';
import { INotificationContext, useUuiContext } from '@epam/uui-core';
import { copyTextToClipboard } from '../../../../helpers';
import { useTokensDoc } from './useTokensDoc';
import { ISemanticTableProps, ISkinTitleProps, ITokensDocGroup, ITokensDocItem, SemanticBlocksProps } from './types';
import cx from 'classnames';
import css from './TokenGroups.module.scss';
// import { ReactComponent as hideDetailsIcon } from '@epam/assets/icons/common/action-eye-off-outline-18.svg';
// import { ReactComponent as showDetailsIcon } from '@epam/assets/icons/common/action-eye-outline-18.svg';

// The config file with titles and descriptions to data groups and subgroups placed here: ( app/src/sandbox/tokens/docs/config.ts )

const showNotification = (color: string, uuiNotifications: INotificationContext) => {
    uuiNotifications
        .show(
            (props) => (
                <SuccessNotification { ...props }>
                    <Text fontSize="14">
                        { `var(${color}) token copied to clipboard!` }
                    </Text>
                </SuccessNotification>
            ),
            { position: 'bot-left' },
        )
        .catch(() => null);
};

export function TokenGroups() {
    const { loading, tokens } = useTokensDoc();

    const renderAllTokens = () => {
        if (loading) {
            return null;
        }
        return tokens.map((group) => <Groups group={ group } level={ 1 } key={ group.id } />);
    };

    return (
        <React.Fragment>
            <Blocker isEnabled={ loading } />
            { renderAllTokens() }
        </React.Fragment>
    );
}

function Groups(props: { group: ITokensDocGroup, level: number }) {
    const { group, level } = props;
    const { title, description } = group;
    const borderRef = useRef(null);

    if (level === 1) {
        return (
            <div>
                <RichTextView size="16">
                    <h2 className={ css.groupTitle }>{ title }</h2>
                    <p ref={ borderRef } className={ css.groupInfo }>{ description }</p>
                </RichTextView>
                <TokenGroupChildren group={ group } level={ 2 } borderRef={ borderRef } />
            </div>
        );
    }
    return (
        <div>
            <RichTextView size="16">
                <h3 className={ css.subgroupTitle }>{ title }</h3>
                <p>{ description }</p>
            </RichTextView>
            <TokenGroupChildren group={ group } level={ 2 } />
        </div>
    );
}
 
function SemanticBlocks(props: SemanticBlocksProps) {
    const { subgroup, openedDropdownId, setOpenedDropdownId } = props;
    const { uuiNotifications } = useUuiContext();

    if (subgroup._type === 'group_with_items') {
        const subgroupItems = subgroup.items.map((item, index) => {
            const valueBackground = item.value ? `var(${item.cssVar})` : 'transparent';

            const renderTooltipContent = () => (
                <FlexCell grow={ 1 }>
                    <FlexCell grow={ 1 }>
                        <div className={ css.semanticTooltipBlock }>
                            <Text fontSize="12" color="tertiary">CSS variable</Text>
                            <Text fontSize="12">{ item.cssVar }</Text>
                        </div>
                        <div className={ cx(css.semanticTooltipBlockMiddle, css.withBorder) }>
                            <Text fontSize="12" color="tertiary">Figma variable</Text>
                            <Text fontSize="12">{ item.cssVar.replace(/^--uui-/, '') }</Text>
                        </div>
                    </FlexCell>
                    <FlexCell grow={ 1 } textAlign="center" cx={ css.semanticTooltipTitle }>
                        <Text fontStyle="italic">
                            Click to copy
                            {' '}
                            <span>
                                var(
                                { item.cssVar }
                                {' '}
                                )
                            </span>
                            {' '}
                            to clipboard
                        </Text>
                    </FlexCell>
                </FlexCell>
            );

            const semanticClickHandler = () => copyTextToClipboard(`var(${item.cssVar})`, () => showNotification(item.cssVar, uuiNotifications));

            const tooltipOnValueChange = (state: boolean, value: string) => {
                if (state) {
                    setOpenedDropdownId(() => value);
                } else {
                    setOpenedDropdownId(() => '');
                }
            };

            return (
                <FlexCell key={ item.cssVar + item.value } grow={ 1 } alignSelf="flex-start">
                    <Tooltip content={ item.value.toUpperCase() } placement="top" openDelay={ 200 }>
                        <div
                            className={ cx(css.colorViewer, (index < 2) && css.bordered) }
                            style={ { backgroundColor: valueBackground } }
                        >
                            { !item.cssVar && <Text color="critical" fontWeight="600">No data...</Text> }
                        </div>
                    </Tooltip>
                    <div>
                        <Tooltip
                            value={ openedDropdownId === item.cssVar }
                            onValueChange={ (state) => tooltipOnValueChange(state, item.cssVar) }
                            closeOnMouseLeave="boundary"
                            maxWidth={ 360 }
                            closeDelay={ 200 }
                            content={ renderTooltipContent() }
                            placement="bottom"
                            openDelay={ 1000 }
                            color="neutral"
                        >
                            <div className={ css.semanticItemsWrapper }>
                                <Text cx={ [css.var] } onClick={ semanticClickHandler }>
                                    {item.cssVar.replace(/^--uui-/, '')}
                                </Text>
                                {/* <Text cx={ [css.semanticItem, !details && css.hiddenItem] } fontSize="12" onClick={ semanticClickHandler }> */}
                                {/*    { item.value.toUpperCase() } */}
                                {/* </Text> */}
                                {/* <Text cx={ [css.semanticItem, !details && css.hiddenItem] } fontSize="12" color="tertiary" onClick={ semanticClickHandler }> */}
                                {/*    { item.baseToken } */}
                                {/* </Text> */}
                            </div>
                        </Tooltip>
                    </div>
                </FlexCell>
            );
        });

        return (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <React.Fragment>
                {subgroupItems}
            </React.Fragment>
        );
    }
}

function SemanticTable({ group, details, borderRef }: ISemanticTableProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [openedDropdownId, setOpenedDropdownId] = useState('');
    // to sort semantic table rows in correct order like in the figma
    const RIGHT_ORDER = ['Primary', 'Secondary', 'Accent', 'Critical', 'Info', 'Success', 'Warning', 'Error'];
    const SKIN_COLOR_TOOLTIP_TEXT = (
        <React.Fragment>
            <div>Skin specific color name</div>
            <div>Used as legacy in some skins</div>
        </React.Fragment>
    );

    useEffect(
        () => {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(() => true);
                } else {
                    setIsVisible(() => false);
                }
            });

            if (borderRef.current instanceof Element) {
                observer.observe(borderRef.current);
                return () => {
                    if (borderRef.current instanceof Element) {
                        observer.unobserve(borderRef.current);
                    }
                };
            }
        },
        [],
    );

    const getSkinTitle = (subgroup: ISkinTitleProps) => {
        const stringArray = subgroup.items[0].baseToken?.split('/');
        if (!stringArray) return undefined;
        const rawTitle = stringArray[stringArray?.length - 1];
        return rawTitle.replace(/[^a-zA-Z]/g, '').replace(/^\w/, (c) => c.toUpperCase());
    };

    return (
        <div>
            <div className={ cx(css.semanticTableHeader, !isVisible && css.withBorder) }>
                <FlexCell grow={ 1 }>
                    {/* <Button */}
                    {/*    cx={ css.hideButton } */}
                    {/*    size="30" */}
                    {/*    fill="none" */}
                    {/*    color="primary" */}
                    {/*    caption={ details ? 'Hide hex' : 'Show hex' } */}
                    {/*    icon={ details ? hideDetailsIcon : showDetailsIcon } */}
                    {/*    onClick={ () => setDetails((prev) => !prev) } */}
                    {/* /> */}
                </FlexCell>
                {group.subgroupsHeader.map((header) => <Text key={ header } fontSize="12" fontStyle="italic" cx={ [css.smallPaddings, css.tableHeader] }>{header}</Text>)}
            </div>
            <div className={ css.semanticTableRows }>
                {group.subgroups.sort((a, b) => RIGHT_ORDER.indexOf(a.title) - RIGHT_ORDER.indexOf(b.title)).map((subgroup) => {
                    let skinThemeTitle = '';
                    if (subgroup._type === 'group_with_items') {
                        skinThemeTitle = getSkinTitle(subgroup);
                    }

                    const semanticProps = { subgroup, details, openedDropdownId, setOpenedDropdownId };

                    return (
                        <React.Fragment key={ subgroup.description }>
                            <FlexCell grow={ 1 } cx={ css.semanticTitleCell }>
                                <FlexRow columnGap="6" cx={ css.semanticTitleRow }>
                                    <Text fontSize="18" fontWeight="600" cx={ css.smallPaddings }>{subgroup.title}</Text>
                                    <Tooltip
                                        content={ SKIN_COLOR_TOOLTIP_TEXT }
                                        placement="top"
                                        openDelay={ 200 }
                                    >
                                        <Text fontSize="16" lineHeight="24" fontWeight="600" color="disabled" cx={ css.smallPaddings }>{skinThemeTitle}</Text>
                                    </Tooltip>
                                </FlexRow>
                                <Text cx={ [css.smallPaddings, css.headerDescription] }>{subgroup.description}</Text>
                            </FlexCell>
                            <SemanticBlocks { ...semanticProps } />
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}

function TokenGroupChildren(props: { group: ITokensDocGroup, level: number, borderRef?: React.MutableRefObject<any> }) {
    const { group } = props;
    const { _type } = group;
    const NO_DATA_IN_GROUP = <Text color="info" fontSize="16" fontStyle="italic">The data of this group is in work. It will be soon...</Text>;
    const [details, setDetails] = useState<boolean>(false);

    if (_type === 'group_with_subgroups') {
        if (group.subgroups.length) {
            return <SemanticTable group={ group } details={ details } setDetails={ setDetails } borderRef={ props.borderRef } />;
        }
        return NO_DATA_IN_GROUP;
    } else {
        if (group.items.length) {
            return (
                <Panel background="surface-main" cx={ css.subgroup } shadow={ true }>
                    <TokenGroupItems items={ group.items } />
                </Panel>
            );
        }
        return NO_DATA_IN_GROUP;
    }
}

function TokenGroupItems(props: { items: ITokensDocItem[] }) {
    const { items } = props;
    const { uuiNotifications } = useUuiContext();

    const tokenGroupItemList = items.map((item) => {
        const valueBackground = item.value ? `var(${item.cssVar})` : 'transparent';
        const renderTooltipContent = () => (
            <span>
                Copy
                {' '}
                <span style={ { color: 'var(--uui-neutral-40)' } }>
                    var(
                    {item.cssVar}
                    )
                </span>
                {' '}
                to clipboard
            </span>
        );

        return (
            <FlexRow cx={ css.tokenCard } borderBottom={ true } alignItems="center" key={ item.value + item.cssVar }>
                <FlexCell width="auto">
                    <Tooltip renderContent={ renderTooltipContent } placement="top" openDelay={ 200 }>
                        <Text cx={ css.var } onClick={ () => copyTextToClipboard(`var(${item.cssVar})`, () => showNotification(item.cssVar, uuiNotifications)) }>
                            { item.cssVar.replace(/^--uui-/, '') }
                        </Text>
                    </Tooltip>
                    {/* { item.description && <Text>{ item.description }</Text> } */}
                    {/* { item.useCases && <Text cx={ css.tokenCardInfo }>{ item.useCases }</Text> } */}
                </FlexCell>
                <FlexSpacer />
                <FlexCell width="auto">
                    <Tooltip content={ item.value || 'No data' } placement="top" openDelay={ 200 }>
                        <div className={ css.colorViewer } style={ { backgroundColor: valueBackground } }>
                            { !item.value && <Text color="critical" fontWeight="600">No data...</Text> }
                        </div>
                    </Tooltip>
                </FlexCell>
            </FlexRow>
        );
    });

    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <React.Fragment>
            {tokenGroupItemList}
        </React.Fragment>
    );
}
