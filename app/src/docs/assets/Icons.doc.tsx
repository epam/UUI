import * as React from 'react';
import css from './IconsPage.module.scss';
import { FlexCell, Panel, FlexRow, Text, IconContainer, Button, IconButton, LinkButton, Tooltip, NotificationCard, MultiSwitch, ScrollBars, SearchInput, TextInput } from '@epam/uui';
import { ArrayDataSource, cx, DataRowProps, DataSourceState, Icon } from '@epam/uui-core';
import { getGroupedIcons, getIconList } from '../../documents/iconListHelpers';
import { copyTextToClipboard } from '../../helpers';
import { svc } from '../../services';
import { ReactComponent as NotificationCheckFillIcon } from '@epam/assets/icons/notification-check-fill.svg';
import { IconList } from '@epam/uui-docs';

const SIZE_LIST = [
    '24', '30', '36', '42', '48',
];

type ControlSize = '24' | '30' | '36' | '42' | '48';

interface IconsPageState extends DataSourceState {
    currentIcon: IconList<Icon>;
    selectedIcon: IconList<Icon>;
    controlSize: ControlSize;
    isLocked: boolean;
}

export class IconsDoc extends React.Component {
    state: IconsPageState = {
        currentIcon: null,
        selectedIcon: null,
        search: '',
        controlSize: '30',
        topIndex: 0,
        visibleCount: 100500,
        isLocked: true,
    };

    typeIcons: IconList<Icon>[] = getIconList(false);
    groupedIcons: { [key: string]: IconList<Icon>[] } = getGroupedIcons();
    componentWillUnmount(): void {
        this.iconsDS.unsubscribeView(this.onDataSourceStateChange);
    }

    showNotification() {
        svc.uuiNotifications.show(
            (props) => (
                <NotificationCard { ...props } icon={ NotificationCheckFillIcon } color="info" onClose={ null }>
                    <Text size="36">
                        Import was copied to the clipboard
                    </Text>
                </NotificationCard>
            ),
            { duration: 3 },
        );
    }

    getImportCode = (icon: IconList<Icon>) => {
        const iconName = icon.name.split('/').reverse()[0].split('.')[0];
        if (iconName.includes('_') || iconName.includes('-')) {
            return `import { ReactComponent as ${iconName.split(new RegExp(['_', '-'].join('|'), 'g')).reduce((p, c) => Number.isInteger(Number(c)) ? p : p.concat(c[0].toUpperCase() + c.slice(1)), '')}Icon } from '${icon.name}';`;
        }

        return `import { ReactComponent as ${iconName}Icon } from '${icon.name}';`;
    };

    renderIconCard() {
        return (
            <Panel cx={ css.iconCard }>
                <FlexRow padding="24" vPadding="48" borderBottom cx={ css.infoBox }>
                    {this.renderPreviewIcon()}
                </FlexRow>
                {this.renderControlSize()}
                <FlexRow padding="24" vPadding="48" borderBottom cx={ css.iconCardDemo }>
                    {this.renderDemo()}
                </FlexRow>
                <FlexRow vPadding="24" padding="24" cx={ css.iconCardImport }>
                    {this.renderImport()}
                </FlexRow>
            </Panel>
        );
    }

    renderPreviewIcon() {
        const selectedItem = this.state.selectedIcon;
        const item = this.state.currentIcon;

        return (
            <FlexCell width="100%">
                <FlexRow cx={ css.infoTitle }>
                    <IconContainer icon={ selectedItem.icon } size={ 36 } cx={ css.previewIcon } />
                    <Text fontSize="18" lineHeight="30" cx={ css.iconCardTitle } fontWeight="600">
                        {item.name}
                    </Text>
                </FlexRow>
                <Text fontSize="16" lineHeight="30" fontWeight="600">
                    Control size
                </Text>
                <MultiSwitch
                    size="30"
                    items={ SIZE_LIST.map((size, index) => ({ id: index, caption: size })) }
                    value={ SIZE_LIST.indexOf(this.state.controlSize) ?? 3 }
                    onValueChange={ (newSize: number) => this.setState({ controlSize: SIZE_LIST[newSize] }) }
                />
            </FlexCell>
        );
    }

    renderImport() {
        const importCode = this.getImportCode(this.state.selectedIcon);
        return (
            <Tooltip placement="left" content="Copy code">
                <button className={ css.importButton } onClick={ () => copyTextToClipboard(importCode, this.showNotification) }>{importCode}</button>
            </Tooltip>
        );
    }

    renderDemo() {
        const icon = this.state.selectedIcon.icon;
        return (
            <FlexCell width="100%">
                <FlexRow size="24" spacing="12" cx={ css.demoExamples }>
                    <FlexCell width="auto" shrink={ 0 }>
                        <IconButton onClick={ () => {} } icon={ icon } />
                    </FlexCell>
                    <FlexCell width="auto" shrink={ 0 }>
                        <Button size={ this.state.controlSize } onClick={ () => {} } icon={ icon } />
                    </FlexCell>
                    <FlexCell width="auto" shrink={ 0 }>
                        <Button caption="Click" size={ this.state.controlSize } onClick={ () => {} } icon={ icon } />
                    </FlexCell>
                    <FlexCell width="auto" shrink={ 0 }>
                        <LinkButton caption="Click" size={ this.state.controlSize } onClick={ () => {} } icon={ icon } />
                    </FlexCell>
                </FlexRow>
                <FlexRow size="24" vPadding="24">
                    <TextInput value="Some text" size={ this.state.controlSize } onValueChange={ () => {} } icon={ icon } />
                </FlexRow>
            </FlexCell>
        );
    }

    renderControlSize() {
        return (
            <div
                className={ cx(css.controlSizeWrapper, {
                    [css.hideControlSize]: this.state.isLocked,
                    [css.showControlSize]: !this.state.isLocked,
                }) }
            >
                <FlexRow padding="24" vPadding="24" spacing="12" size="24" borderBottom cx={ css.controlSizeContent }>
                    <FlexCell width="auto">
                        <Text fontWeight="600" size="24" fontSize="14">
                            Control size:
                        </Text>
                    </FlexCell>
                    <FlexCell width="auto">
                        <MultiSwitch
                            size="24"
                            items={ SIZE_LIST.map((size) => ({ id: size, caption: size })) }
                            value={ this.state.controlSize }
                            onValueChange={ (newValue) => this.setState({ controlSize: newValue }) }
                        />
                    </FlexCell>
                </FlexRow>
            </div>
        );
    }

    renderItem(item: IconList<Icon>) {
        return (
            <div
                key={ item.id }
                className={ cx(css.item, this.state.currentIcon && this.state.currentIcon.id === item.id && css.activeItem) }
                onClick={ () =>
                    this.setState({
                        currentIcon: item,
                        selectedIcon: this.groupedIcons[item.name][0],
                        isLocked: true,
                    }) }
            >
                <IconContainer cx={ css.itemIcon } icon={ item.icon } />
                <Text size="18" color="secondary" cx={ css.itemName }>
                    {item.name}
                </Text>
            </div>
        );
    }

    renderIconsBox(items: DataRowProps<IconList<Icon>, string>[]) {
        if (items.length === 0) {
            return (
                <div className={ css.unsuccessfulSearch }>
                    <Text fontSize="16" lineHeight="24" cx={ css.unsuccessfulSearchText }>
                        Unfortunately, we did not find
                        <span>
                            {' '}
                            {this.state.search}
                            {' '}
                        </span>
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

        return <div className={ css.grid }>{items.map((item) => this.renderItem(item.value))}</div>;
    }

    iconsDS = new ArrayDataSource({
        items: this.typeIcons,
    });

    onDataSourceStateChange = (data: DataSourceState) => this.setState(data);
    render() {
        const view = this.iconsDS.getView(this.state, this.onDataSourceStateChange, { getSearchFields: (l) => [l.name] });
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
                            value={ this.state.search }
                            onValueChange={ (value) => this.setState({ search: value }) }
                        />
                        <FlexCell>{this.renderIconsBox(items)}</FlexCell>
                    </FlexCell>
                    {items.length > 0 && (
                        <FlexCell minWidth={ 380 } cx={ cx(css.stickyPanel, css[`sticky-panel-height-${this.state.isLocked ? '563' : '612'}`]) }>
                            {this.state.currentIcon && this.renderIconCard()}
                        </FlexCell>
                    )}
                </ScrollBars>
            </div>
        );
    }
}
