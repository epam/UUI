import {
    TAccordionPreview,
    TAlertPreview,
    TAvatarStackPreview,
    TBadgePreview,
    TButtonPreview,
    TCheckboxPreview,
    TCountIndicatorPreview,
    TDatePickerPreview,
    TIconButtonPreview,
    TLinkButtonPreview, TNumericInputPreview,
    TPickerInputPreview,
    TRangeDatePickerPreview,
    TSwitchPreview,
    TTabButtonPreview,
    TTagPreview,
    TTextAreaPreview,
    TTextInputPreview,
    TTextPreview,
    TVerticalTabButtonPreview,
} from './previewIds';
import { TPreviewSkin, TPreviewTheme } from '../types';

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
 * Keep list of previews in sync with corresponding *.doc.tsx files
 */
export type TPreviewIdByComponentId = {
    [TComponentId.accordion]: TAccordionPreview[],
    [TComponentId.alert]: TAlertPreview[],
    [TComponentId.avatarStack]: TAvatarStackPreview[],
    [TComponentId.badge]: TBadgePreview[],
    [TComponentId.button]: TButtonPreview[],
    [TComponentId.checkbox]: TCheckboxPreview[],
    [TComponentId.countIndicator]: TCountIndicatorPreview[],
    [TComponentId.datePicker]: TDatePickerPreview[],
    [TComponentId.iconButton]: TIconButtonPreview[],
    [TComponentId.linkButton]: TLinkButtonPreview[],
    [TComponentId.pickerInput]: TPickerInputPreview[],
    [TComponentId.rangeDatePicker]: TRangeDatePickerPreview[],
    [TComponentId.switch]: TSwitchPreview[],
    [TComponentId.tabButton]: TTabButtonPreview[],
    [TComponentId.tag]: TTagPreview[],
    [TComponentId.text]: TTextPreview[],
    [TComponentId.textArea]: TTextAreaPreview[],
    [TComponentId.textInput]: TTextInputPreview[],
    [TComponentId.verticalTabButton]: TVerticalTabButtonPreview[],
    [TComponentId.numericInput]: TNumericInputPreview[],
};

export const THEMES = {
    allExceptVanillaThunder: Object.values(TPreviewTheme).filter((t) => t !== TPreviewTheme.vanilla_thunder),
};

export const SKINS = {
    all: Object.values(TPreviewSkin),
    allExceptElectric: Object.values(TPreviewSkin).filter((t) => t !== TPreviewSkin.electric),
};

export function isSkinCompatibleWithTheme(skin: TPreviewSkin, theme: TPreviewTheme) {
    if (skin === TPreviewSkin.loveship) {
        return [TPreviewTheme.loveship_dark, TPreviewTheme.loveship].includes(theme);
    }
    return skin.toString() === theme.toString();
}
