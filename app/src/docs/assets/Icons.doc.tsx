import React, { useState } from 'react';
import css from './IconsPage.module.scss';
import { FlexCell, Panel, FlexRow, Text, IconContainer, Button, IconButton, LinkButton, Tooltip, NotificationCard, MultiSwitch,
    ScrollBars, SearchInput, TextInput } from '@epam/uui';
import { cx, Icon, useArrayDataSource } from '@epam/uui-core';
import { getAllIcons } from '../../documents/iconListHelpers';
import { copyTextToClipboard } from '../../helpers';
import { svc } from '../../services';
import { IconBase } from '@epam/uui-docs';
import { ReactComponent as NotificationCheckFillIcon } from '@epam/assets/icons/notification-check-fill.svg';
import { useAppThemeContext } from '../../helpers/appTheme';

const SIZE_LIST: ControlSize[] = ['24', '30', '36', '42', '48'];
const THEMES_6PX = ['electric', 'loveship', 'loveship_dark', 'vanilla_thunder', 'promo', 'eduverse_light', 'eduverse_dark'];

type ControlSize = '24' | '30' | '36' | '42' | '48';

interface IconsPageState {
    currentIcon: IconBase<Icon> | null;
    selectedIcon: IconBase<Icon> | null;
    search: string;
    controlSize: ControlSize;
    topIndex: number;
    visibleCount: number;
}

export function IconsDoc() {
    const [state, setState] = useState<IconsPageState>({
        currentIcon: null,
        selectedIcon: null,
        search: '',
        controlSize: '36',
        topIndex: 0,
        visibleCount: 100500,
    });
    const { theme } = useAppThemeContext();

    const allIcons: IconBase<Icon>[] = getAllIcons<Icon>();

    const iconsDS = useArrayDataSource<IconBase<Icon>, string, unknown>({
        items: allIcons,
    }, []);

    const showNotification = () => {
        svc.uuiNotifications.show(
            (props) => (
                <NotificationCard { ...props } icon={ NotificationCheckFillIcon } color="info" onClose={ null }>
                    <Text size="36">Import was copied to the clipboard</Text>
                </NotificationCard>
            ),
            { duration: 3 },
        ).catch(() => {});
    };

    const renderIconCard = () => {
        return (
            <Panel cx={ css.iconCard }>
                <FlexRow padding="24" vPadding="48" borderBottom cx={ css.infoBox }>
                    {renderPreviewIcon()}
                </FlexRow>
                <FlexRow padding="24" vPadding="48" borderBottom cx={ css.iconCardDemo }>
                    {renderDemo()}
                </FlexRow>
                <FlexRow vPadding="24" padding="24" cx={ css.iconCardImport }>
                    {renderImport()}
                </FlexRow>
            </Panel>
        );
    };

    const renderControlSize = () => {
        if (!THEMES_6PX.includes(theme)) {
            return null;
        }

        return (
            <>
                <Text cx={ css.topMargin } fontSize="16" lineHeight="30" fontWeight="600">
                    Control size:
                </Text>
                <MultiSwitch
                    size="30"
                    items={ SIZE_LIST.map((size, index) => ({ id: index, caption: size })) }
                    value={ SIZE_LIST.indexOf(state.controlSize) ?? 3 }
                    onValueChange={ (newSize: number) => setState({ ...state, controlSize: SIZE_LIST[newSize] }) }
                />
            </>
        );
    };

    const renderPreviewIcon = () => (
        <FlexCell width="100%">
            <FlexRow cx={ css.infoTitle }>
                <IconContainer icon={ state.selectedIcon.icon } size={ 36 } cx={ css.previewIcon } />
                <Text fontSize="18" lineHeight="30" fontWeight="600">
                    {state.currentIcon.name}
                </Text>
            </FlexRow>
            { renderControlSize() }
        </FlexCell>
    );

    const getImportCode = (icon: IconBase<Icon>) => {
        const iconName = icon.name.split('/').reverse()[0].split('.')[0];

        if (iconName.includes('_') || iconName.includes('-')) {
            return `import { ReactComponent as ${iconName.split(new RegExp(['_', '-'].join('|'), 'g')).reduce((p, c) => Number.isInteger(Number(c)) ? p : p.concat(c[0].toUpperCase() + c.slice(1)), '')}Icon } from '${icon.path}/${icon.name}';`;
        }
        return `import { ReactComponent as ${iconName}Icon } from '${icon.path}/${icon.name}';`;
    };

    const renderImport = () => {
        const importCode = getImportCode(state.selectedIcon);
        return (
            <Tooltip placement="left" content="Copy code">
                <button className={ css.importButton } onClick={ () => copyTextToClipboard(importCode, showNotification) }>
                    {importCode}
                </button>
            </Tooltip>
        );
    };

    const renderDemo = () => {
        const icon = state.selectedIcon.icon;
        const size = THEMES_6PX.includes(theme) ? state.controlSize : undefined;
        return (
            <FlexCell width="100%">
                <FlexRow size="24" columnGap="12">
                    <FlexCell width="auto" shrink={ 0 }>
                        <IconButton size={ size as any } onClick={ () => {} } icon={ icon } />
                    </FlexCell>
                    <FlexCell width="auto" shrink={ 0 }>
                        <Button size={ size } onClick={ () => {} } icon={ icon } />
                    </FlexCell>
                    <FlexCell width="auto" shrink={ 0 }>
                        <Button caption="Click" size={ size } onClick={ () => {} } icon={ icon } />
                    </FlexCell>
                    <FlexCell width="auto" shrink={ 0 }>
                        <LinkButton caption="Click" size={ size } onClick={ () => {} } icon={ icon } />
                    </FlexCell>
                </FlexRow>
                <FlexRow size="24" vPadding="24">
                    <TextInput value="Some text" size={ size } onValueChange={ () => {} } icon={ icon } />
                </FlexRow>
            </FlexCell>
        );
    };

    const renderItem = (item: IconBase<Icon>) => {
        return (
            <div
                key={ item.id }
                className={ cx(css.item, state.currentIcon && state.currentIcon.id === item.id && css.activeItem) }
                onClick={ () => setState({
                    ...state,
                    currentIcon: item,
                    selectedIcon: item,
                }) }
            >
                <IconContainer cx={ css.itemIcon } icon={ item.icon } />
                <Text size="none" color="secondary" cx={ css.itemName }>
                    {item.name}
                </Text>
            </div>
        );
    };

    const renderIconsBox = (items: any[]) => {
        if (items.length === 0) {
            return (
                <div className={ css.unsuccessfulSearch }>
                    <Text fontSize="16" lineHeight="24" cx={ css.unsuccessfulSearchText }>
                        Unfortunately, we did not find
                        <span>
                            {' '}
                            {state.search}
                            {' '}
                        </span>
                        {' '}
                        icon in our package. But we can add it in the next release.
                    </Text>
                    <FlexRow>
                        <Button
                            caption="Request an Icon"
                            color="accent"
                            href="https://www.figma.com/file/M5Njgc6SQJ3TPUccp5XHQx/UUI-Components?type=design&node-id=3133-127742&mode=design&t=d5bUL7HS0crIw6Xt-4"
                        />
                    </FlexRow>
                </div>
            );
        }
        return <div className={ css.grid }>{items.map((item) => renderItem(item.value))}</div>;
    };

    const onDataSourceStateChange = (data: any) => setState(data);
    const view = iconsDS.useView(state, onDataSourceStateChange, { getSearchFields: (l) => [l.name] });
    const items = view.getVisibleRows();

    return (
        <div className={ css.container }>
            <ScrollBars cx={ css.contentContainer }>
                <FlexCell width="100%" cx={ css.iconsBlock }>
                    <div className={ css.title }>Icons</div>
                    <SearchInput
                        cx={ css.search }
                        size="42"
                        placeholder="Search icon"
                        value={ state.search }
                        onValueChange={ (value) => setState((currentState) => ({ ...currentState, search: value })) }
                    />
                    <FlexCell>{renderIconsBox(items)}</FlexCell>
                </FlexCell>
                {items.length > 0 && (
                    <FlexCell minWidth={ 380 } cx={ css.stickyPanel }>
                        {state.currentIcon && renderIconCard()}
                    </FlexCell>
                )}
            </ScrollBars>
        </div>
    );
}
