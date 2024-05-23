/**
 *
 * Preview IDs are used for screenshot tests
 *
 * These files MUST be kept in sync:
 * app/src/docs/_types/previewIds.ts --> uui-e2e-tests/src/data/previewIds.ts
 */

/**
 * Common reusable names. Use it for consistency (if possible).
 */
const UTILS = {
    SizeVariants: { 'Size Variants': 'Size Variants' },
    ColorVariants: { 'Color Variants': 'Color Variants' },
    CommonVariants: { 'Common Variants': 'Common Variants' },
};

export enum TAvatarStackPreview {
    'Smaller size' = 'Smaller size',
    'Bigger size' = 'Bigger size'
}

export enum TTextInputPreview {
    'Form'= 'Form',
    'Form States'= 'Form States',
    'Inline'= 'Inline',
    'Inline States'= 'Inline States'
}

export enum TAccordionPreview {
    Expanded = 'Expanded',
    Collapsed = 'Collapsed'
}

export enum TPickerInputPreview {
    // FORM
    'Form SingleSelect'= 'Form SingleSelect',
    'Form SingleSelect States'= 'Form SingleSelect States',
    'Form MultiSelect'= 'Form MultiSelect',
    'Form MultiSelect States'= 'Form MultiSelect States',
    'Form MultiSelect Multiline'= 'Form MultiSelect Multiline',
    'Form MultiSelect Multiline States'= 'Form MultiSelect Multiline States',
    // FORM OPENED
    'Form Opened SingleSelect' = 'Form Opened SingleSelect',
    'Form Opened MultiSelect' = 'Form Opened MultiSelect',
    'Form Opened SingleSelect Tree' = 'Form Opened SingleSelect Tree',
    'Form Opened MultiSelect Tree' = 'Form Opened MultiSelect Tree',
    // INLINE
    'Inline SingleSelect'= 'Inline SingleSelect',
    'Inline SingleSelect States'= 'Inline SingleSelect States',
    'Inline MultiSelect'= 'Inline MultiSelect',
    'Inline MultiSelect States'= 'Inline MultiSelect States',
    'Inline MultiSelect Multiline'= 'Inline MultiSelect Multiline',
    'Inline MultiSelect Multiline States'= 'Inline MultiSelect Multiline States',
    // CELL
    'Cell SingleSelect'= 'Cell SingleSelect',
    'Cell SingleSelect States'= 'Cell SingleSelect States',
    'Cell MultiSelect'= 'Cell MultiSelect',
    'Cell MultiSelect States'= 'Cell MultiSelect States',
    'Cell MultiSelect Multiline'= 'Cell MultiSelect Multiline',
    'Cell MultiSelect Multiline States'= 'Cell MultiSelect Multiline States'
}

export enum TDatePickerPreview {
    Form = 'Form',
    'Form Opened' = 'Form Opened',
    'Form States' = 'Form States',
    Cell = 'Cell',
    'Cell States' = 'Cell States',
    Inline = 'Inline',
    'Inline States' = 'Inline States'
}

export const TBadgePreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TCheckboxPreview = { ...UTILS.CommonVariants };
export const TCountIndicatorPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TIconButtonPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TLinkButtonPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TMainMenuPreview = { ...UTILS.CommonVariants };
export const TMultiSwitchPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TNotificationCardPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TNumericInputPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TPaginatorPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TRadioGroupPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TRadioInputPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TSwitchPreview = { ...UTILS.CommonVariants };
export const TTagPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TTextAreaPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TTextPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TTooltipPreview = { ...UTILS.CommonVariants };
export const TAlertPreview = {
    ...UTILS.ColorVariants,
    'Layout with icon': 'Layout with icon',
    'Layout without icon': 'Layout without icon',
};
export const TButtonPreview = {
    'One-line caption': 'One-line caption',
    'Two-line caption': 'Two-line caption',
    'No caption': 'No caption',
    ...UTILS.ColorVariants,
};
export const TTabButtonPreview = {
    ...UTILS.SizeVariants,
    ...UTILS.ColorVariants,
    'Dropdown Size Variants': 'Dropdown Size Variants',
    'Dropdown Color Variants': 'Dropdown Color Variants',
};
export const TVerticalTabButtonPreview = { ...TTabButtonPreview };
export const TLabeledInputPreview = {
    'Color Variants Label Top': 'Color Variants Label Top',
    'Color Variants Label Left': 'Color Variants Label Left',
    ...UTILS.SizeVariants,
};
export const TRangeDatePickerPreview = {
    ...UTILS.SizeVariants,
    ...UTILS.ColorVariants,
    Opened: 'Opened',
    'Opened With Presets': 'Opened With Presets',
};
