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
    SizeVariants: { 'Size Variants': 'Size Variants' as const },
    ColorVariants: { 'Color Variants': 'Color Variants' as const },
    AllVariants: { 'All Variants': 'All Variants' as const },
};

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

export const TBadgePreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TCheckboxPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TCountIndicatorPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TIconButtonPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TLinkButtonPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TMainMenuPreview = { ...UTILS.AllVariants };
export const TMultiSwitchPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TNotificationCardPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TNumericInputPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TPaginatorPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TRadioGroupPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TRadioInputPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TSwitchPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TTagPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TTextAreaPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TTextPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TTooltipPreview = { ...UTILS.ColorVariants };
export const TAlertPreview = {
    ...UTILS.ColorVariants,
    'Layout with icon': 'Layout with icon' as const,
    'Layout without icon': 'Layout without icon' as const,
};
export const TButtonPreview = {
    'One-line caption': 'One-line caption' as const,
    'Two-line caption': 'Two-line caption' as const,
    'No caption': 'No caption' as const,
    ...UTILS.ColorVariants,
};
export const TTabButtonPreview = {
    ...UTILS.SizeVariants,
    ...UTILS.ColorVariants,
    'Dropdown Size Variants': 'Dropdown Size Variants' as const,
    'Dropdown Color Variants': 'Dropdown Color Variants' as const,
};
export const TVerticalTabButtonPreview = { ...TTabButtonPreview };
export const TLabeledInputPreview = {
    'Color Variants Label Top': 'Color Variants Label Top' as const,
    'Color Variants Label Left': 'Color Variants Label Left' as const,
    ...UTILS.SizeVariants,
};
export const TRangeDatePickerPreview = {
    ...UTILS.SizeVariants,
    ...UTILS.ColorVariants,
    Opened: 'Opened' as const,
    'Opened With Presets': 'Opened With Presets' as const,
};
export const TTextInputPreview = {
    'Form Size Variants': 'Form Size Variants' as const,
    'Inline Size Variants': 'Inline Size Variants' as const,
    ...UTILS.ColorVariants,
};
export const TDatePickerPreview = {
    ...UTILS.SizeVariants,
    ...UTILS.ColorVariants,
    'Form Opened': 'Form Opened' as const,
};
export const TDropdownContainerPreview = {
    ...UTILS.SizeVariants,
};
export const TAvatarStackPreview = {
    'Smaller size': 'Smaller size',
    'Bigger size': 'Bigger size',
};
export const TAccordionPreview = {
    'All Variants Expanded': 'All Variants Expanded',
    'All Variants Collapsed': 'All Variants Collapsed',
};
