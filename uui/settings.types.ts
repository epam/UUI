interface DefaultSizes {
    badge: string;
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
    labeledInput: string;
    statusIndicator: string;
    dataTableCell: string,
    dataTableRow: string,
    dataTableHeaderCell: string,
    dataTableHeaderRow: string,
    paginator: string,
}

interface Sizes {
    [size: string | number]: string | number;
}

interface TextSize {
    fontSize?: string | number;
    fontWeight?: string | number;
    lineHeight?: string | number;
    size?: string | number;
}

interface UppercaseTextSize {
    uppercase: string;
}

interface UtmostSize {
    utmost: string | number;
}

interface EditableSize {
    editable: string | number;
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
    columnGap: string;
    verticalPadding: Sizes;
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
    icon: Sizes & DefaultSize;
    indentUnit: Sizes & DefaultSize;
    indentWidth: Sizes & DefaultSize;
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

interface LabeledInputSizes {
    fillIcon: string[];
}

interface BadgeSizes {
    countIndicator: Sizes;
}

interface DataTableHeaderCellTooltipContentSizes {
    caption: TextSize;
    info: TextSize;
}

interface DataTableHeaderCellSizes {
    checkbox: Sizes;
    columnCaption: TextSize & UppercaseTextSize;
    iconSize: Sizes;
    resizeMarker: DefaultSize;
    leftPadding: DefaultSize & UtmostSize;
    rightPadding: DefaultSize & UtmostSize;
    tooltip: DataTableHeaderCellTooltipContentSizes;
}

interface DataTableHeaderRowSizes {
    iconSize: Sizes;
    truncate?: string[];
}

interface DataTableCellSizes {
    text: Sizes;
    leftPadding: EditableSize & DefaultSize & UtmostSize;
    rightPadding: EditableSize & DefaultSize & UtmostSize;
}

interface DataTableRowSizes {
    columnsGap: DefaultSize;
}

interface DataTableColumnsConfigurationModal {
    columnRowSize: string;
    columnGap: string;
    padding: string;
    pinIconButtonGap: string;
    groupTitleSize: string;
    groupTitleFontSize: string;
    groupTitleFontWeight: string;
    subgroupTitleSize: string;
    subgroupTitleFontSize: string;
    subgroupTitleFontWeight: string;
    subgroupTitleIconSize: string;
    searchAreaSize: string;
    searchSize: string;
    noFoundTitleSize: string;
    noFoundTitleFontSize: string;
    noFoundTitleFontWeight: string;
    noFoundSubTitleSize: string;
    noFoundSubTitleFontSize: string;
    noFoundSubTitleFontWeight: string;
}

interface PaginatorSizes {}

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
    labeledInput: LabeledInputSizes;
    badge: BadgeSizes;
    dataTableHeaderCell: DataTableHeaderCellSizes;
    dataTableHeaderRow: DataTableHeaderRowSizes;
    dataTableCell: DataTableCellSizes;
    dataTableRow: DataTableRowSizes;
    dataTableColumnsConfigurationModal: DataTableColumnsConfigurationModal;
    paginator: PaginatorSizes;
}

export interface Settings {
    /**
     * setting sizes for complex and compound components to support 'Size theming'
     */
    sizes: SizesSettings;
}
