interface DefaultSizes {
    button: string;
    checkbox: string;
    countIndicator: string;
    dataPickerCell: string;
    linkButton: string;
    numericInput: string;
    pickerToggler: string;
    pickerItem: string;
    radioInput: string;
    switch: string;
    tabButton: string;
    tag: string;
    text: string;
    textArea: string;
    textInput: string;
    rangeDatePicker: string;
    datePicker: string;
}

interface Sizes {
    [size: string | number]: string | number;
}

interface DefaultSize {
    default: string | number;
}

interface MobileSize {
    mobile: string | number;
}

interface ModalSize {
    modal: string | number;
}

interface TagSizes {
    countIndicator: Sizes;
}

interface MobileDropdownWrapperSizes {
    linkButton: string;
}

interface PickerInputRowSizes extends MobileSize, ModalSize {
    padding: ModalSize & DefaultSize;
}

interface PickerInputSizes {
    height: number;
    width: number;
    rowSize: PickerInputRowSizes;
}

interface PickerTogglerSizes {
    tag: Sizes;
}

interface DataPickerHeaderTextSizes {
    fontWeight: string;
    size: string;
}

interface DataPickerHeaderSizes {
    text: DataPickerHeaderTextSizes;
}

interface DataPickerBodySizes {
    flexCell: DefaultSize;
    searchInput: MobileSize,
}

interface PickerItemAvatarSizes {
    rest: Sizes;
    multiline: Sizes;
}

interface PickerItemSizes {
    avatar: PickerItemAvatarSizes;
}

interface DataPickerCellIsBoldIcon {
    [size: string | number]: boolean;
}

interface DataPickerCellSizes {
    isBoldIcon: DataPickerCellIsBoldIcon;
    padding: DefaultSize;
    paddingLeft: DefaultSize;
    text: Sizes;
    icon: Sizes;
}

interface DataPickerRowSizes {
    padding: DefaultSize;
    dataPickerCell: DefaultSize;
}

interface DataPickerFooterSizes {
    flexRowPadding: string;
    switch: Sizes;
    linkButton: Sizes & MobileSize;
}

interface RowAddonsSizes {
    checkbox: Sizes;
    icon: Sizes;
    indentUnit: Sizes & DefaultSize;
    indentWidth: Sizes & DefaultSize;
}

interface TextSize {
    lineHeight: string | number;
    fontSize: string | number;
}

interface TextSizes {
    [size: string | number]: TextSize;
}

interface FilterPickerBodySizes {
    pickerItem: string,
    dataPickerRow: string,
    dataPickerFooter: string,
    searchSize: string,
}

interface SizesSettings {
    defaults: DefaultSizes;
    tag: TagSizes;
    mobileDropdownWrapper: MobileDropdownWrapperSizes;
    pickerInput: PickerInputSizes;
    pickerToggler: PickerTogglerSizes;
    dataPickerHeader: DataPickerHeaderSizes;
    dataPickerBody: DataPickerBodySizes;
    pickerItem: PickerItemSizes;
    dataPickerCell: DataPickerCellSizes;
    dataPickerRow: DataPickerRowSizes;
    dataPickerFooter: DataPickerFooterSizes;
    rowAddons: RowAddonsSizes;
    text: TextSizes;
    filterPickerBody: FilterPickerBodySizes;
}

export interface Settings {
    /**
     * setting sizes for complex and compound components to support 'Size theming'
     */
    sizes: SizesSettings;
}
