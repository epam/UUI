import React from 'react';
import { ReactComponent as CrossIcon } from '@epam/assets/icons/navigation-close-outline.svg';
import { ReactComponent as DropdownIcon } from '@epam/assets/icons/navigation-chevron_down-outline.svg';
import { ReactComponent as CheckIcon } from '@epam/assets/icons/notification-done-outline.svg';
import { ReactComponent as PartlySelectIcon } from '@epam/assets/icons/content-minus-outline.svg';
import { ReactComponent as SearchIcon } from '@epam/assets/icons/action-search-outline.svg';
import { ReactComponent as CalendarIcon } from '@epam/assets/icons/action-calendar-fill.svg';
import { ReactComponent as InfoIcon } from '@epam/assets/icons/notification-info-outline.svg';
import { ReactComponent as FillInfoIcon } from '@epam/assets/icons/notification-info-fill.svg';
import { ReactComponent as EmptyTableIcon } from './icons/pictures/empty-table.svg';
import { ReactComponent as AscSortIcon } from '@epam/assets/icons/table-sort_asc-outline.svg';
import { ReactComponent as DescSortIcon } from '@epam/assets/icons/table-sort_desc-outline.svg';
import { ReactComponent as DragIndicatorIcon } from '@epam/assets/icons/action-drag_indicator-outline.svg';
import { ReactComponent as MenuIcon } from '@epam/assets/icons/navigation-more_vert-outline.svg';
import { ReactComponent as ResetIcon } from '@epam/assets/icons/navigation-refresh-outline.svg';
import { ReactComponent as LockIcon } from '@epam/assets/icons/action-lock-fill.svg';
import { ReactComponent as PinLeftIcon } from '@epam/assets/icons/table-group_column_left-fill.svg';
import { ReactComponent as PinRightIcon } from '@epam/assets/icons/table-group_column_right-fill.svg';
import { ReactComponent as DefaultSortIcon } from '@epam/assets/icons/table-swap-outline.svg';
import { ReactComponent as FilterIcon } from '@epam/assets/icons/content-filtration-fill.svg';
import { ReactComponent as OpenedDropdownIcon } from '@epam/assets/icons/navigation-chevron_up-outline.svg';
import { ReactComponent as FoldIcon } from '@epam/assets/icons/navigation-collapse_all-outline.svg';
import { ReactComponent as UnfoldIcon } from '@epam/assets/icons/navigation-expand_all-outline.svg';
import { ReactComponent as ConfigIcon } from '@epam/assets/icons/action-settings-fill.svg';
import { ReactComponent as LeftArrowIcon } from '@epam/assets/icons/navigation-chevron_left-outline.svg';
import { ReactComponent as RightArrowIcon } from '@epam/assets/icons/navigation-chevron_right-outline.svg';
import { ReactComponent as AddIcon } from '@epam/assets/icons/action-add-outline.svg';
import { ReactComponent as BoldSelectIcon } from '@epam/assets/icons/notification-done-fill.svg';
import { ReactComponent as DotIcon } from '@epam/assets/icons/radio_dot-fill.svg';
import { ReactComponent as HintIcon } from '@epam/assets/icons/notification-help-fill.svg';
import { ReactComponent as SuccessIcon } from '@epam/assets/icons/notification-check-fill.svg';
import { ReactComponent as WarningIcon } from '@epam/assets/icons/notification-warning-fill.svg';
import { ReactComponent as ErrorIcon } from '@epam/assets/icons/notification-error-fill.svg';
import { ReactComponent as RemoveIcon } from '@epam/assets/icons/action-delete-outline.svg';
import { ReactComponent as CopyLinkIcon } from '@epam/assets/icons/content-link-outline.svg';
import { ReactComponent as RenameIcon } from '@epam/assets/icons/content-edit-fill.svg';
import { ReactComponent as CopyIcon } from '@epam/assets/icons/action-copy_content-outline.svg';
import { ReactComponent as DiscardChangesIcon } from '@epam/assets/icons/content-edit_undo-outline.svg';
import { ReactComponent as SaveAsNewIcon } from '@epam/assets/icons/action-save-outline.svg';

import { ReactComponent as DocIcon } from '@epam/assets/icons/file-file_word-fill.svg';
import { ReactComponent as ExelIcon } from '@epam/assets/icons/file-file_excel-fill.svg';
import { ReactComponent as PdfIcon } from '@epam/assets/icons/file-file_pdf-fill.svg';
import { ReactComponent as ImgIcon } from '@epam/assets/icons/file-file_image-fill.svg';
import { ReactComponent as VideoIcon } from '@epam/assets/icons/file-file_video-fill.svg';
import { ReactComponent as TableIcon } from '@epam/assets/icons/file-file_table-fill.svg';
import { ReactComponent as TextIcon } from '@epam/assets/icons/file-file_text-fill.svg';
import { ReactComponent as MailIcon } from '@epam/assets/icons/file-file_eml-fill.svg';
import { ReactComponent as FileIcon } from '@epam/assets/icons/file-file-fill.svg';

import { ReactComponent as FilledStarIcon } from './icons/star-filled.svg';
import { ReactComponent as NotFoundSearchIcon } from './icons/pictures/search-with-background.svg';

import type { Icon } from '@epam/uui-core';
import type { AvatarProps, BlockerProps } from '@epam/uui-components';
import type {
    AlertProps, LinkButtonProps, BadgeProps, CountIndicatorProps, ButtonProps, CheckboxProps,
    DataTableHeaderRowProps, DataTableHeaderCellProps, DataTableRowProps,
    SearchInputProps, FlexRowProps, TextProps, DatePickerProps, FiltersPanelProps,
    DataPickerRowProps, PickerItemProps, DataPickerFooterProps, LabeledInputProps, NumericInputProps,
    PickerTogglerProps, PickerTogglerTagProps, TagProps, SwitchProps, RangeDatePickerProps, RadioInputProps,
    RatingProps, RichTextViewProps, DataRowAddonsProps, StatusIndicatorProps, TabButtonProps, VerticalTabButtonProps, TextAreaProps,
    TextInputProps, PickerInputProps, MultiSwitchProps, RangeDatePickerInputProps, IconButtonProps, VirtualListProps,
} from './components';
import { Spinner } from './components/widgets/Spinner';
import { TextPlaceholder } from './components/typography/TextPlaceholder';
import { Text } from './components/typography/Text';
import { Blocker } from './components/layout/Blocker';

type Sizes<S extends string | number | symbol, T> = {
    [size in S]: T;
};

interface AccordionIcons {
    dropdownIcon: Icon;
}

interface AccordionSettings {
    icons: AccordionIcons;
}

const accordionSettings: AccordionSettings = {
    icons: {
        dropdownIcon: DropdownIcon,
    },
};

interface AlertIcons {
    closeIcon: Icon;
    infoIcon: Icon;
    successIcon: Icon;
    warningIcon: Icon;
    errorIcon: Icon;
}

interface AlertSizes {
    default: AlertProps['size'];
    actionMap: Sizes<AlertProps['size'], LinkButtonProps['size']>;
}

interface AlertSettings {
    icons: AlertIcons;
    sizes: AlertSizes;
}

const alertSettings: AlertSettings = {
    icons: {
        closeIcon: CrossIcon,
        infoIcon: FillInfoIcon,
        successIcon: SuccessIcon,
        warningIcon: WarningIcon,
        errorIcon: ErrorIcon,
    },
    sizes: {
        default: '48',
        actionMap: {
            36: '24',
            48: '30',
        },
    },
};

interface BadgeIcons {
    dropdownIcon: Icon;
}

interface BadgeSizes {
    default: BadgeProps['size'];
    countIndicatorMap: Sizes<BadgeProps['size'], CountIndicatorProps['size']>;
}

interface BadgeSettings {
    icons: BadgeIcons;
    sizes: BadgeSizes;
}
const badgeSettings: BadgeSettings = {
    icons: {
        dropdownIcon: DropdownIcon,
    },
    sizes: {
        default: '36',
        countIndicatorMap: {
            18: '12',
            24: '18',
            30: '18',
            36: '18',
            42: '24',
            48: '24',
        },
    },
};

interface ButtonIcons {
    clearIcon: Icon;
    dropdownIcon: Icon;
}

interface ButtonSizes {
    default: ButtonProps['size'];
}

interface ButtonSettings {
    icons: ButtonIcons;
    sizes: ButtonSizes;
}

const buttonSettings: ButtonSettings = {
    icons: {
        clearIcon: CrossIcon,
        dropdownIcon: DropdownIcon,
    },
    sizes: {
        default: '36',
    },
};

interface CheckboxIcons {
    checkIcon: Icon;
    indeterminateIcon: Icon;
}

interface CheckboxSizes {
    default: CheckboxProps['size'];
}

interface CheckboxSettings {
    icons: CheckboxIcons;
    sizes: CheckboxSizes;
}

const checkboxSettings: CheckboxSettings = {
    icons: {
        checkIcon: CheckIcon,
        indeterminateIcon: PartlySelectIcon,
    },
    sizes: {
        default: '18',
    },
};

interface CountIndicatorSizes {
    default: CountIndicatorProps['size'];
}

interface CountIndicatorSettings {
    sizes: CountIndicatorSizes;
}

const countIndicatorSettings: CountIndicatorSettings = {
    sizes: {
        default: '24',
    },
};

interface DataTableIcons {
    emptyTable: Icon;
    header: {
        configIcon: Icon;
        ascSortIcon: Icon;
        descSortIcon: Icon;
        defaultSortIcon: Icon;
        filterIcon: Icon;
        dropdownIcon: Icon;
        openedDropdownIcon: Icon;
        foldIcon: Icon;
        unfoldIcon: Icon;
    };
    body: {
        foldingIcon: Icon,
    };
    columnsConfigurationModal: {
        dragIndicator: Icon;
        lockIcon: Icon;
        pinLeftIcon: Icon;
        pinRightIcon: Icon;
        menuIcon: Icon;
        resetIcon: Icon;
        expandedIcon: Icon;
        collapsedIcon: Icon;
    };
}

interface DataTableSizes {
    columnsConfigurationModal: {
        columnRow: FlexRowProps['size'];
        countIndicator: CountIndicatorProps['size'];
        menuButton: ButtonProps['size'];
        searchInput: SearchInputProps['size'];
    };
    header: {
        row: DataTableHeaderRowProps['size'];
        iconMap: Sizes<DataTableHeaderCellProps<unknown, unknown>['size'], string>;
    };
    body: {
        row: DataTableRowProps['size'];
        checkboxMap: Sizes<DataRowAddonsProps<unknown, unknown>['size'], CheckboxProps['size']>;
        iconMap: Sizes<DataRowAddonsProps<unknown, unknown>['size'], number | string>;
        indentUnitMap: Sizes<DataRowAddonsProps<unknown, unknown>['size'], number>;
        indentWidthMap: Sizes<DataRowAddonsProps<unknown, unknown>['size'], number>;
    };
}

interface DataTableSettings {
    icons: DataTableIcons;
    sizes: DataTableSizes;
    renderPlaceholder?: (props: { rowSize: DataTableRowProps['size'] }) => React.ReactNode;
}

const dataTableSettings: DataTableSettings = {
    renderPlaceholder: (props) => <Text size={ props.rowSize }><TextPlaceholder /></Text>,
    icons: {
        emptyTable: EmptyTableIcon,
        header: {
            configIcon: ConfigIcon,
            ascSortIcon: AscSortIcon,
            descSortIcon: DescSortIcon,
            defaultSortIcon: DefaultSortIcon,
            filterIcon: FilterIcon,
            dropdownIcon: DropdownIcon,
            openedDropdownIcon: OpenedDropdownIcon,
            foldIcon: FoldIcon,
            unfoldIcon: UnfoldIcon,
        },
        body: {
            foldingIcon: DropdownIcon,
        },
        columnsConfigurationModal: {
            dragIndicator: DragIndicatorIcon,
            lockIcon: LockIcon,
            pinLeftIcon: PinLeftIcon,
            pinRightIcon: PinRightIcon,
            collapsedIcon: RightArrowIcon,
            expandedIcon: DropdownIcon,
            menuIcon: MenuIcon,
            resetIcon: ResetIcon,
        },
    },
    sizes: {
        header: {
            row: '36',
            iconMap: {
                36: '18',
                48: '18',
                60: '18',
            },
        },
        body: {
            row: '36',
            checkboxMap: {
                24: '12',
                30: '18',
                36: '18',
                42: '18',
                48: '18',
                60: '18',
            },
            iconMap: {
                24: '12',
                30: '18',
                36: '18',
                42: '24',
                48: '24',
                60: '24',
            },
            indentUnitMap: {
                24: 6,
                30: 12,
                36: 12,
                42: 24,
                48: 24,
                60: 24,
            },
            indentWidthMap: {
                24: 12,
                30: 18,
                36: 18,
                42: 24,
                48: 24,
                60: 24,
            },
        },
        columnsConfigurationModal: {
            columnRow: '30',
            countIndicator: '18',
            menuButton: '30',
            searchInput: '30',
        },
    },
};

interface DropdownMenuIcons {
    acceptIcon: Icon;
    dropdownIcon: Icon;
}

interface DropdownMenuSettings {
    icons: DropdownMenuIcons;
}

const dropdownMenuSettings: DropdownMenuSettings = {
    icons: {
        acceptIcon: CheckIcon,
        dropdownIcon: DropdownIcon,
    },
};

interface DatePickerIcons {
    body: {
        prevIcon: Icon;
        nextIcon: Icon;
    };
    input: {
        calendarIcon: Icon;
    };
}

interface DatePickerSizes {
    input: DatePickerProps['size'];
    body: DatePickerProps['size'];
}

interface DatePickerSettings {
    icons: DatePickerIcons;
    sizes: DatePickerSizes;
}

const datePickerSettings: DatePickerSettings = {
    icons: {
        body: {
            prevIcon: LeftArrowIcon,
            nextIcon: RightArrowIcon,
        },
        input: {
            calendarIcon: CalendarIcon,
        },
    },
    sizes: {
        body: '36',
        input: '36',
    },
};

interface FileCardIcons {
    docIcon: Icon,
    exelIcon: Icon,
    pdfIcon: Icon,
    imgIcon: Icon,
    videoIcon: Icon,
    tableIcon: Icon,
    textIcon: Icon,
    mailIcon: Icon,
    fileIcon: Icon,
    closeIcon: Icon,
    errorIcon: Icon,
}

interface FileCardSettings {
    icons: FileCardIcons,
}

const fileCardSettings: FileCardSettings = {
    icons: {
        docIcon: DocIcon,
        exelIcon: ExelIcon,
        pdfIcon: PdfIcon,
        imgIcon: ImgIcon,
        videoIcon: VideoIcon,
        tableIcon: TableIcon,
        textIcon: TextIcon,
        mailIcon: MailIcon,
        fileIcon: FileIcon,
        closeIcon: CrossIcon,
        errorIcon: ErrorIcon,
    },
};

interface FlexRowSizes {
    default: FlexRowProps['size'];
}

interface FlexRowSettings {
    sizes: FlexRowSizes;
}

const flexRowSettings: FlexRowSettings = {
    sizes: {
        default: '36',
    },
};

interface FiltersPanelIcons {
    addFilterIcon: Icon;
    itemDropdownIcon: Icon;
    pickerBodyRemoveIcon: Icon;
}

interface FiltersPanelSizes {
    default: FiltersPanelProps<unknown>['size'];
    footerLinkButton: LinkButtonProps['size'];
    mobileFooterLinkButton: LinkButtonProps['size'];
    pickerBodyMultiSwitch: MultiSwitchProps['size'];
    pickerBodyLinkButton: LinkButtonProps['size'];
    pickerBodyMinWidth: number;
    rangeDatePickerInput: RangeDatePickerInputProps['size'];
}

interface FiltersPanelSettings {
    icons: FiltersPanelIcons;
    sizes: FiltersPanelSizes;
    renderPlaceholder: () => React.ReactNode;
}

const filtersPanelSettings: FiltersPanelSettings = {
    renderPlaceholder: () => <TextPlaceholder />,
    icons: {
        addFilterIcon: AddIcon,
        itemDropdownIcon: DropdownIcon,
        pickerBodyRemoveIcon: RemoveIcon,
    },
    sizes: {
        default: '36',
        footerLinkButton: '36',
        mobileFooterLinkButton: '48',
        pickerBodyMultiSwitch: '24',
        pickerBodyLinkButton: '24',
        pickerBodyMinWidth: 360,
        rangeDatePickerInput: '30',
    },
};

interface IconButtonSettings {
    icons: {
        dropdownIcon: Icon;
    }
}

const iconButtonSettings: IconButtonSettings = {
    icons: {
        dropdownIcon: DropdownIcon,
    },
};

interface LabeledInputIcons {
    infoIcon: Icon;
    fillInfoIcon: Icon;
}

interface LabeledInputSizes {
    default: LabeledInputProps['size'];
}

interface LabeledInputSettings {
    icons: LabeledInputIcons;
    sizes: LabeledInputSizes;
}

const labeledInputSettings: LabeledInputSettings = {
    icons: {
        infoIcon: InfoIcon,
        fillInfoIcon: FillInfoIcon,
    },
    sizes: {
        default: '36',
    },
};

interface LinkButtonIcons {
    dropdownIcon: Icon;
}

interface LinkButtonSizes {
    default: LinkButtonProps['size'];
}

interface LinkButtonSettings {
    icons: LinkButtonIcons;
    sizes: LinkButtonSizes;
    weight: LinkButtonProps['weight'];
}

const linkButtonSettings: LinkButtonSettings = {
    icons: {
        dropdownIcon: DropdownIcon,
    },
    sizes: {
        default: '36',
    },
    weight: 'semibold',
};

interface ModalIcons {
    closeIcon: Icon;
}

interface ModalSettings {
    icons: ModalIcons;
}

const modalSettings: ModalSettings = {
    icons: {
        closeIcon: CrossIcon,
    },
};

interface NotificationCardIcons {
    closeIcon: Icon;
    hintIcon: Icon;
    successIcon: Icon;
    warningIcon: Icon;
    errorIcon: Icon;
}

interface NotificationCardSizes {
    action: LinkButtonProps['size'];
    icon: number;
}

interface NotificationCardSettings {
    icons: NotificationCardIcons;
    sizes: NotificationCardSizes;
}

const notificationCardSettings: NotificationCardSettings = {
    icons: {
        closeIcon: CrossIcon,
        hintIcon: HintIcon,
        successIcon: SuccessIcon,
        warningIcon: WarningIcon,
        errorIcon: ErrorIcon,
    },
    sizes: {
        action: '30',
        icon: 24,
    },
};

interface NumericInputIcons {
    arrowIcon: Icon;
}

interface NumericInputSizes {
    default: NumericInputProps['size'];
}

interface NumericInputSettings {
    icons: NumericInputIcons;
    sizes: NumericInputSizes;
}

const numericInputSettings: NumericInputSettings = {
    icons: {
        arrowIcon: DropdownIcon,
    },
    sizes: {
        default: '36',
    },
};

interface PaginatorIcons {
    leftArrowIcon: Icon;
    rightArrowIcon: Icon;
}

interface PaginatorSizes {
    default: ButtonProps['size'];
}

interface PaginatorSettings {
    icons: PaginatorIcons;
    sizes: PaginatorSizes;
}

const paginatorSettings: PaginatorSettings = {
    icons: {
        leftArrowIcon: LeftArrowIcon,
        rightArrowIcon: RightArrowIcon,
    },
    sizes: {
        default: '30',
    },
};

type SelectIconType = Icon | ((size: DataPickerRowProps<unknown, unknown>['size']) => Icon);

interface PickerInputIcons {
    toggler: {
        clearIcon: Icon;
        dropdownIcon: Icon;
    },
    body: {
        selectIcon: SelectIconType;
        pickerBodyMobileHeaderCloseIcon: Icon;
        modalNotFoundSearchIcon: Icon;
    }
}

interface PickerInputSizes {
    toggler: {
        default: PickerTogglerProps<unknown, unknown>['size'];
        tag: PickerTogglerTagProps<unknown, unknown>['size'];
        tagMap: Sizes<PickerTogglerTagProps<unknown, unknown>['size'], TagProps['size']>;
    };
    body: {
        maxHeight: number;
        minWidth: number;
        row: DataPickerRowProps<unknown, unknown>['size'];
        itemAvatarMap: Sizes<PickerItemProps<unknown, unknown>['size'], AvatarProps['size']>;
        itemAvatarMultilineMap: Sizes<PickerItemProps<unknown, unknown>['size'], AvatarProps['size']>;
        itemVerticalPaddingMap: Sizes<PickerItemProps<unknown, unknown>['size'], string>;
        selectIconMap: Sizes<DataPickerRowProps<unknown, unknown>['size'], string>;
        footerSwitchMap: Sizes<DataPickerFooterProps<unknown, unknown>['size'], SwitchProps['size']>;
        mobileFooterLinkButton: LinkButtonProps['size'];
        mobileRow: DataPickerRowProps<unknown, unknown>['size'];
        getSearchSize: (props: { pickerSize: PickerInputProps<unknown, unknown>['size'] }) => SearchInputProps['size'];
        mobileSearchInput: SearchInputProps['size'];
    };
}

interface PickerInputSettings {
    icons: PickerInputIcons;
    sizes: PickerInputSizes;
    renderPlaceholder?: (props: { rowSize: DataPickerRowProps<unknown, unknown>['size'] }) => React.ReactNode;
    renderBlocker?: VirtualListProps['renderBlocker'];
}

const pickerInputSettings: PickerInputSettings = {
    renderPlaceholder: (props) => <Text size={ props.rowSize }><TextPlaceholder /></Text>,
    renderBlocker: (props) => <Blocker isEnabled={ props.isLoading } />,
    icons: {
        toggler: {
            clearIcon: CrossIcon,
            dropdownIcon: DropdownIcon,
        },
        body: {
            selectIcon: (size: DataPickerRowProps<unknown, unknown>['size']) => size < '30' ? BoldSelectIcon : CheckIcon,
            pickerBodyMobileHeaderCloseIcon: CrossIcon,
            modalNotFoundSearchIcon: NotFoundSearchIcon,
        },
    },
    sizes: {
        toggler: {
            default: '36',
            tag: '36',
            tagMap: {
                24: '18',
                30: '18',
                36: '24',
                42: '30',
                48: '36',
            },
        },
        body: {
            maxHeight: 300,
            minWidth: 360,
            row: '36',
            itemAvatarMap: {
                24: '18',
                30: '24',
                36: '30',
                42: '36',
                48: '36',
            },
            itemAvatarMultilineMap: {
                24: '30',
                30: '30',
                36: '36',
                42: '42',
                48: '48',
            },
            itemVerticalPaddingMap: {
                24: '3',
                30: '6',
                36: '9',
                42: '6',
                48: '9',
            },
            selectIconMap: {
                24: '12',
                30: '18',
                36: '18',
                42: '24',
                48: '24',
            },
            footerSwitchMap: {
                24: '12',
                30: '18',
                36: '18',
                42: '24',
                48: '24',
            },
            mobileFooterLinkButton: '48',
            mobileRow: '48',
            mobileSearchInput: '48',
            getSearchSize: ({ pickerSize }) => {
                return pickerSize;
            },
        },
    },
};

interface PresetPanelIcons {
    addIcon: Icon;
    copyIcon: Icon;
    copyLinkIcon: Icon;
    deleteIcon: Icon;
    discardChangesIcon: Icon;
    renameIcon: Icon;
    menuIcon: Icon;
    saveAsNewIcon: Icon;
    saveInCurrentIcon: Icon;
}

interface PresetPanelSizes {
    tabButton: TabButtonProps['size'];
    dropdownTargetIconButton: IconButtonProps['size'];
}

interface PresetsPanelSettings {
    icons: PresetPanelIcons;
    sizes: PresetPanelSizes;
}

const presetsPanelSettings: PresetsPanelSettings = {
    icons: {
        addIcon: AddIcon,
        copyIcon: CopyIcon,
        copyLinkIcon: CopyLinkIcon,
        deleteIcon: RemoveIcon,
        discardChangesIcon: DiscardChangesIcon,
        menuIcon: MenuIcon,
        renameIcon: RenameIcon,
        saveAsNewIcon: SaveAsNewIcon,
        saveInCurrentIcon: ResetIcon,
    },
    sizes: {
        tabButton: '60',
        dropdownTargetIconButton: '18',
    },
};

interface RadioInputIcons {
    dotIcon: Icon;
}

interface RadioInputSizes {
    default: RadioInputProps['size'];
}

interface RadioInputSettings {
    icons: RadioInputIcons;
    sizes: RadioInputSizes;
}

const radioInputSettings: RadioInputSettings = {
    icons: {
        dotIcon: DotIcon,
    },
    sizes: {
        default: '18',
    },
};

interface RangeDatePickerIcons {
    input: {
        calendarIcon: Icon;
    }
}

interface RangeDatePickerSizes {
    default: RangeDatePickerProps['size'];
    preset: LinkButtonProps['size'];
}

interface RangeDatePickerSettings {
    icons: RangeDatePickerIcons;
    sizes: RangeDatePickerSizes;
}

const rangeDatePickerSettings: RangeDatePickerSettings = {
    icons: {
        input: {
            calendarIcon: CalendarIcon,
        },
    },
    sizes: {
        default: '36',
        preset: '24',
    },
};

interface RatingIcons {
    filledRatingIcon: Icon;
    emptyRatingIcon: Icon;
}

interface RatingSizes {
    default: RatingProps['size'];
}

interface RatingSettings {
    icons: RatingIcons;
    sizes: RatingSizes;
}

const ratingSettings: RatingSettings = {
    icons: {
        filledRatingIcon: FilledStarIcon,
        emptyRatingIcon: FilledStarIcon,
    },
    sizes: {
        default: 18,
    },
};

interface RichTextViewSizes {
    default: RichTextViewProps['size'];
}

interface RichTextViewSettings {
    sizes: RichTextViewSizes;
}

const richTextViewSettings: RichTextViewSettings = {
    sizes: {
        default: '14',
    },
};

interface StatusIndicatorSizes {
    default: StatusIndicatorProps['size'];
}

interface StatusIndicatorSettings {
    sizes: StatusIndicatorSizes;
}

const statusIndicatorSettings: StatusIndicatorSettings = {
    sizes: {
        default: '24',
    },
};

interface SwitchSizes {
    default: SwitchProps['size'];
}

interface SwitchSettings {
    sizes: SwitchSizes;
}

const switchSettings: SwitchSettings = {
    sizes: {
        default: '18',
    },
};

interface TabButtonIcons {
    clearIcon: Icon;
    dropdownIcon: Icon;
}

interface TabButtonSizes {
    default: TabButtonProps['size'];
    countIndicatorMap: Sizes<TabButtonProps['size'], CountIndicatorProps['size']>;
}

interface TabButtonSettings {
    icons: TabButtonIcons;
    sizes: TabButtonSizes;
}

const tabButtonSettings: TabButtonSettings = {
    icons: {
        clearIcon: CrossIcon,
        dropdownIcon: DropdownIcon,
    },
    sizes: {
        default: '48',
        countIndicatorMap: {
            36: '18',
            48: '18',
            60: '18',
        },
    },
};

interface VerticalTabButtonIcons {
    clearIcon: Icon;
    foldingIcon: Icon;
    dropdownIcon: Icon;
}

interface VerticalTabButtonSizes {
    default: VerticalTabButtonProps<unknown, unknown>['size'];
    countIndicatorMap: Sizes<VerticalTabButtonProps<unknown, unknown>['size'], CountIndicatorProps['size']>;
}

interface VerticalTabButtonSettings {
    icons: VerticalTabButtonIcons;
    sizes: VerticalTabButtonSizes;
    weight: VerticalTabButtonProps<unknown, unknown>['weight'];
}

const verticalTabButtonSettings: VerticalTabButtonSettings = {
    icons: {
        clearIcon: CrossIcon,
        foldingIcon: DropdownIcon,
        dropdownIcon: DropdownIcon,
    },
    sizes: {
        default: '48',
        countIndicatorMap: {
            30: '18',
            36: '18',
            48: '18',
        },
    },
    weight: 'semibold',
};

interface TagIcons {
    clearIcon: Icon;
    dropdownIcon: Icon;
}

interface TagSizes {
    default: TagProps['size'];
    countIndicatorMap: Sizes<TagProps['size'], CountIndicatorProps['size']>;
}

interface TagSettings {
    icons: TagIcons;
    sizes: TagSizes;
}

const tagSettings: TagSettings = {
    icons: {
        clearIcon: CrossIcon,
        dropdownIcon: DropdownIcon,
    },
    sizes: {
        default: '36',
        countIndicatorMap: {
            18: '12',
            24: '18',
            30: '18',
            36: '18',
            42: '24',
            48: '24',
        },
    },
};

interface TextSettings {
    sizes: {
        default: TextProps['size'];
    };
}

const textSettings: TextSettings = {
    sizes: {
        default: '36',
    },
};

interface TextAreaSizes {
    default: TextAreaProps['size'];
}

interface TextAreaSettings {
    sizes: TextAreaSizes;
}

const textAreaSettings: TextAreaSettings = {
    sizes: {
        default: '36',
    },
};

interface TextInputIcons {
    acceptIcon: Icon,
    clearIcon: Icon,
    dropdownIcon: Icon,
    searchIcon: Icon,
}

interface TextInputSizes {
    default: TextInputProps['size'];
}

interface TextInputSettings {
    icons: TextInputIcons;
    sizes: TextInputSizes;
}

const textInputSettings: TextInputSettings = {
    icons: {
        acceptIcon: CheckIcon,
        clearIcon: CrossIcon,
        dropdownIcon: DropdownIcon,
        searchIcon: SearchIcon,
    },
    sizes: {
        default: '36',
    },
};

interface BlockerSettings {
    renderSpinner?: BlockerProps['renderSpinner']
}

const blockerSettings: BlockerSettings = {
    renderSpinner: () => <Spinner />,
};

export const settings = {
    accordion: accordionSettings,
    alert: alertSettings,
    badge: badgeSettings,
    button: buttonSettings,
    blocker: blockerSettings,
    checkbox: checkboxSettings,
    countIndicator: countIndicatorSettings,
    dataTable: dataTableSettings,
    datePicker: datePickerSettings,
    dropdownMenu: dropdownMenuSettings,
    flexRow: flexRowSettings,
    fileCard: fileCardSettings,
    filtersPanel: filtersPanelSettings,
    iconButton: iconButtonSettings,
    labeledInput: labeledInputSettings,
    linkButton: linkButtonSettings,
    modal: modalSettings,
    notificationCard: notificationCardSettings,
    numericInput: numericInputSettings,
    paginator: paginatorSettings,
    pickerInput: pickerInputSettings,
    presetsPanel: presetsPanelSettings,
    radioInput: radioInputSettings,
    rangeDatePicker: rangeDatePickerSettings,
    rating: ratingSettings,
    richTextView: richTextViewSettings,
    statusIndicator: statusIndicatorSettings,
    switch: switchSettings,
    tabButton: tabButtonSettings,
    verticalTabButton: verticalTabButtonSettings,
    tag: tagSettings,
    text: textSettings,
    textArea: textAreaSettings,
    textInput: textInputSettings,
};

export type Settings = typeof settings;

type DeepPartial<T> = T extends object ? {
    [P in keyof T]? : DeepPartial<T[P]>
} : T;

export type PartialSettings = DeepPartial<Settings>;
