/**
 * Keep in sync with app/src/documents/structureComponents.ts
 */
export enum TComponentId {
    accordion= 'accordion',
    adaptivePanel= 'adaptivePanel',
    advancedTables= 'advancedTables',
    alert= 'alert',
    anchor= 'anchor',
    avatar= 'avatar',
    avatarStack= 'avatarStack',
    badge= 'badge',
    blocker= 'blocker',
    button= 'button',
    checkbox= 'checkbox',
    checkboxGroup= 'checkboxGroup',
    controlGroup= 'controlGroup',
    countIndicator= 'countIndicator',
    datePicker= 'datePicker',
    dropdown= 'dropdown',
    dropdownContainer= 'dropdownContainer',
    dropdownMenu = 'dropdownMenu',
    editableTables= 'editableTables',
    fileUpload= 'fileUpload',
    filtersPanel= 'filtersPanel',
    flexCell= 'flexCell',
    flexItems= 'flexItems',
    flexRow= 'flexRow',
    flexSpacer= 'flexSpacer',
    form= 'form',
    iconButton= 'iconButton',
    iconContainer= 'iconContainer',
    labeledInput= 'labeledInput',
    linkButton= 'linkButton',
    mainMenu= 'mainMenu',
    modals= 'modals',
    multiSwitch= 'multiSwitch',
    notificationCard= 'notificationCard',
    numericInput= 'numericInput',
    paginator= 'paginator',
    panel= 'panel',
    pickerInput= 'pickerInput',
    PickerList= 'PickerList',
    pickerModal= 'pickerModal',
    presetsPanel= 'presetsPanel',
    progressBar= 'progressBar',
    radioGroup= 'radioGroup',
    radioInput= 'radioInput',
    rangeDatePicker= 'rangeDatePicker',
    rating= 'rating',
    richTextEditor= 'richTextEditor',
    richTextView= 'richTextView',
    rteOverview= 'rteOverview',
    rteSerializers= 'rteSerializers',
    scrollSpy= 'scrollSpy',
    searchInput= 'searchInput',
    slider= 'slider',
    sliderRating= 'sliderRating',
    spinner= 'spinner',
    statusIndicator= 'statusIndicator',
    'switch' = 'switch',
    tabButton= 'tabButton',
    tables= 'tables',
    tablesOverview= 'tablesOverview',
    tag= 'tag',
    text= 'text',
    textArea= 'textArea',
    textInput= 'textInput',
    textPlaceholder= 'textPlaceholder',
    timePicker= 'timePicker',
    tooltip= 'tooltip',
    useTableState= 'useTableState',
    verticalTabButton= 'verticalTabButton',
    virtualList= 'virtualList'
}

/**
 * Copy these enums from the respective *.doc.tsx files
 */

export enum TBadgePreview {
    'Colors' = 'Colors',
    'Sizes with icon' = 'Sizes with icon',
    'Sizes without icon' = 'Sizes without icon'
}
export enum TButtonPreview {
    'One-line caption' = 'One-line caption',
    'Two-line caption' = 'Two-line caption',
    'No caption' = 'No caption',
    Colors = 'Colors'
}
export enum TLinkButtonPreview {
    'One-line caption' = 'One-line caption',
    'Two-line caption' = 'Two-line caption',
    'No caption' = 'No caption',
    Colors = 'Colors'
}
export enum TAvatarStackPreview {
    'Smaller size' = 'Smaller size',
    'Bigger size' = 'Bigger size'
}
export enum TTagPreview {
    'One-line caption' = 'One-line caption',
    'Two-line caption' = 'Two-line caption',
    'No caption' = 'No caption',
    Colors = 'Colors'
}
export enum TSwitchPreview {
    Basic = 'Basic'
}
export enum TCheckboxPreview {
    Basic = 'Basic'
}
export enum TTextInputPreview {
    'Form'= 'Form',
    'Form (invalid)'= 'Form (invalid)',
    'Form (disabled)'= 'Form (disabled)',
    'Form (read only)'= 'Form (read only)',
    'Inline'= 'Inline',
    'Inline (disabled)'= 'Inline (disabled)',
    'Inline (read only)'= 'Inline (read only)'
}
export enum TCountIndicatorPreview {
    Colors = 'Colors',
    Sizes = 'Sizes'
}
export enum TAccordionPreview {
    Expanded = 'Expanded',
    Collapsed = 'Collapsed'
}
export enum TAlertPreview {
    Colors = 'Colors',
    'Layout with icon' = 'Layout with icon',
    'Layout without icon' = 'Layout without icon'
}
export enum TIconButtonPreview {
    Colors = 'Colors',
    Layout = 'Layout'
}

/**
 * Keep list of previews in sync with corresponding *.doc.tsx files
 */
export type TPreviewIdByComponentId = {
    [TComponentId.badge]: TBadgePreview[],
    [TComponentId.button]: TButtonPreview[],
    [TComponentId.linkButton]: TLinkButtonPreview[],
    [TComponentId.textInput]: TTextInputPreview[],
    [TComponentId.avatarStack]: TAvatarStackPreview[],
    [TComponentId.tag]: TTagPreview[],
    [TComponentId.switch]: TSwitchPreview[],
    [TComponentId.checkbox]: TCheckboxPreview[],
    [TComponentId.countIndicator]: TCountIndicatorPreview[],
    [TComponentId.accordion]: TAccordionPreview[],
    [TComponentId.alert]: TAlertPreview[],
    [TComponentId.iconButton]: TIconButtonPreview[],
};
