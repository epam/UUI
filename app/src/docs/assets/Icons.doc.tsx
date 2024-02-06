import * as React from 'react';
import css from './IconsPage.module.scss';
import {
    FlexCell,
    Panel,
    FlexRow,
    Text,
    IconContainer,
    Button,
    IconButton,
    LinkButton,
    Tooltip,
    FlexSpacer,
    NotificationCard,
    MultiSwitch,
    ScrollBars,
    SearchInput,
    TextInput,
} from '@epam/uui';
import {
    ArrayDataSource, cx, DataRowProps, DataSourceState, Icon,
} from '@epam/uui-core';
import { getGroupedIcons, getIconList } from '../../documents/iconListHelpers';
import { ReactComponent as LockedIcon } from '@epam/assets/icons/common/action-lock-fill-18.svg';
import { ReactComponent as UnlockedIcon } from '@epam/assets/icons/common/action-lock_open-fill-18.svg';
import { copyTextToClipboard } from '../../helpers';
import { svc } from '../../services';
import { ReactComponent as NotificationIcon } from '../../icons/notification-check-fill-24.svg';
import { ReactComponent as WarningIcon } from '../../icons/notification-error-fill-24.svg';
import { IconList } from '@epam/uui-docs';

const sizeList = [
    '24', '30', '36', '42', '48',
];

const recommendedSizes: { [key: string]: string[] } = {
    12: ['24'],
    18: [
        '30', '36', '42',
    ],
    24: ['48'],
};

type ControlSize = '24' | '30' | '36' | '42' | '48';

interface IconsPageState extends DataSourceState {
    currentIcon: IconList<Icon>;
    selectedIcon: IconList<Icon>;
    controlSize: ControlSize;
    isLocked: boolean;
    currentIconSizes?: string[];
}

export class IconsDoc extends React.Component {
    state: IconsPageState = {
        currentIcon: null,
        selectedIcon: null,
        search: '',
        controlSize: null,
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
                <NotificationCard { ...props } icon={ NotificationIcon } color="info" onClose={ null }>
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
                <FlexRow padding="24" vPadding="48" borderBottom>
                    {this.renderPreviewIcon()}
                </FlexRow>
                {this.renderRecommendedSize()}
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
        const iconList = this.groupedIcons[item.name].slice().reverse();

        return (
            <FlexCell width="100%" cx={ css.infoBox }>
                <FlexRow>
                    <Text fontSize="24" lineHeight="30" cx={ css.iconCardTitle }>
                        {item.name}
                    </Text>
                    <FlexSpacer />
                    <Button
                        color="secondary"
                        size="30"
                        fill="ghost"
                        icon={ this.state.isLocked ? LockedIcon : UnlockedIcon }
                        onClick={ () => this.setState({ isLocked: !this.state.isLocked }) }
                        cx={ css.lockButton }
                    />
                </FlexRow>

                <FlexRow spacing="12" alignItems="bottom">
                    <FlexCell width="auto" shrink={ 0 } textAlign="center">
                        <IconContainer icon={ selectedItem.icon } size={ 100 } cx={ css.previewIcon } />
                        <div className={ css.iconBoxLabel }>Preview</div>
                    </FlexCell>
                    {iconList.map((i) => (
                        <FlexCell key={ i.id } width="auto" cx={ css.iconBox } shrink={ 0 }>
                            <IconContainer
                                icon={ i.icon }
                                cx={ cx(css.sizeIcon, selectedItem.id === i.id && css.selectedIcon, !this.state.isLocked && css.selectableIcon) }
                                onClick={ this.state.isLocked ? null : () => this.setState({ selectedIcon: i }) }
                            />
                            <div className={ css.iconBoxLabel }>{i.size || 'special'}</div>
                        </FlexCell>
                    ))}
                </FlexRow>
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

    checkValidSize = () => {
        if (typeof recommendedSizes[this.state.selectedIcon.size] === 'undefined') {
            return false;
        } else {
            return recommendedSizes[this.state.selectedIcon.size].some((i) => i === this.state.controlSize);
        }
    };

    renderRecommendedSize() {
        const item = this.state.currentIcon;
        const iconList = this.groupedIcons[item.name];
        const iconSizesList = iconList.map((i) => i.size + '');
        const isRecommendedSizeAvailable = typeof recommendedSizes[this.state.selectedIcon.size] !== 'undefined';

        const handleIconSizeChange = (size: string, control: string) => {
            return iconSizesList.some((i) => i === size)
                ? this.setState({ controlSize: control, selectedIcon: iconList.filter((i) => i.size.toString() === size)[0] })
                : null;
        };

        return (
            isRecommendedSizeAvailable && (
                <FlexRow cx={ css.recommendedSize } padding="24" vPadding="48" borderBottom>
                    <FlexCell width="100%" cx={ css.recommendedSizeIcon }>
                        <Text size="18" fontSize="14" fontWeight="600" cx={ css.recommendedCaption }>
                            Use the recommended icon sizes:
                        </Text>
                        <FlexRow padding={ null } vPadding={ null } margin={ null } cx={ css.recommendedSizeIconRow }>
                            <FlexCell minWidth={ 227 }>
                                <FlexRow vPadding={ null } padding={ null }>
                                    <FlexCell minWidth={ 42 } cx={ css.sizesCaptions }>
                                        <Text size="30" fontSize="12" color="secondary">
                                            Control:
                                        </Text>
                                        <Text size="30" fontSize="12" color="secondary">
                                            Icon:
                                        </Text>
                                    </FlexCell>
                                    {Object.keys(recommendedSizes).map((size) =>
                                        recommendedSizes[size].map((control) => (
                                            <Tooltip key={ control } content={ !iconSizesList.some((i) => i === size) && 'There is no size for this icon' }>
                                                <FlexCell
                                                    key={ control }
                                                    minWidth={ 30 }
                                                    onClick={ () => handleIconSizeChange(size, control) }
                                                    cx={ cx(
                                                        css.sizes,
                                                        iconSizesList.some((i) => i === size) ? css.activeSizes : css.disabledSizes,
                                                        control === this.state.controlSize && size === this.state.selectedIcon.size.toString() && css.selectedSizes,
                                                    ) }
                                                >
                                                    <Text size="30" fontWeight="600" cx={ css.sizesText }>
                                                        {control}
                                                    </Text>
                                                    <Text size="30" cx={ css.sizesText }>
                                                        {size}
                                                    </Text>
                                                </FlexCell>
                                            </Tooltip>
                                        )))}
                                </FlexRow>
                            </FlexCell>
                            {!this.checkValidSize() && this.renderWarningIcon()}
                        </FlexRow>
                        <FlexCell width="100%">
                            {!Object.keys(recommendedSizes).every((i) => iconSizesList.includes(i)) && (
                                <FlexRow size="24" spacing="6" alignItems="bottom">
                                    <LinkButton
                                        cx={ css.bottomText }
                                        caption="Contact us"
                                        size="24"
                                        href="https://www.figma.com/file/UyChXPLmyv5zMrOU37KdUL/UUI4-(Components)?node-id=14983%3A274834"
                                        target="_blank"
                                    />
                                    <Text size="30" cx={ css.bottomText }>
                                        {' '}
                                        if you need more icon sizes
                                    </Text>
                                </FlexRow>
                            )}
                        </FlexCell>
                    </FlexCell>
                </FlexRow>
            )
        );
    }

    renderWarningIcon() {
        return (
            <FlexCell minWidth={ 60 } cx={ css.warningWrapper }>
                <Tooltip placement="top-end" content="We don't recommend this combination of sizes">
                    <IconContainer icon={ WarningIcon } cx={ [css.warningIcon, css.iconRed] } />
                </Tooltip>
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
                            items={ sizeList.map((size) => ({ id: size, caption: size })) }
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
                        controlSize: recommendedSizes[item.size] ? recommendedSizes[item.size][0] : '36',
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
                            href="https://www.figma.com/file/UyChXPLmyv5zMrOU37KdUL/UUI4-(Components)?node-id=14983%3A274834"
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
