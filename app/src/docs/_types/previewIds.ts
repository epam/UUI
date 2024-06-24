/**
 * This file is referenced by "uui-e2e-tests" module
 */

/**
 * Common reusable names. Use it for consistency (if possible).
 */
const UTILS = {
    States: { States: 'States' as const },
    SizeVariants: { 'Size Variants': 'Size Variants' as const },
    ColorVariants: { 'Color Variants': 'Color Variants' as const },
    AllVariants: { 'All Variants': 'All Variants' as const },
};

export enum TPickerInputPreview {
    'Modes + States' = 'Modes + States',
    'Sizes single'= 'Sizes Single',
    'Sizes multi'= 'Sizes Multi',
    'Sizes multi multiline'= 'Sizes Multi multiline',
    'Opened single' = 'Opened Single',
    'Opened multi' = 'Opened Multi'
}

export const TBadgePreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TCheckboxPreview = { ...UTILS.SizeVariants, ...UTILS.States };
export const TCountIndicatorPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TIconButtonPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TLinkButtonPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TMainMenuPreview = { ...UTILS.AllVariants };
export const TMultiSwitchPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TNotificationCardPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TNumericInputPreview = { ...UTILS.SizeVariants, ...UTILS.States };
export const TPaginatorPreview = { ...UTILS.SizeVariants, ...UTILS.States };
export const TRadioGroupPreview = { ...UTILS.SizeVariants, ...UTILS.States };
export const TRadioInputPreview = { ...UTILS.SizeVariants, ...UTILS.States };
export const TSwitchPreview = { ...UTILS.SizeVariants, ...UTILS.States };
export const TTagPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TTextAreaPreview = { ...UTILS.SizeVariants, ...UTILS.States };
export const TTextPreview = { ...UTILS.SizeVariants, ...UTILS.ColorVariants };
export const TTextInputPreview = { ...UTILS.SizeVariants, ...UTILS.States };
export const TTabButtonPreview = { ...UTILS.SizeVariants, ...UTILS.States };
export const TVerticalTabButtonPreview = { ...TTabButtonPreview };

export const TTooltipPreview = { ...UTILS.ColorVariants };
export const TAlertPreview = {
    ...UTILS.ColorVariants,
    Layout: 'Layout' as const,
};
export const TButtonPreview = {
    ...UTILS.SizeVariants,
    ...UTILS.ColorVariants,
};

export const TLabeledInputPreview = {
    'Label Top Cases': 'Label Top Cases' as const,
    'Label Left Cases': 'Label Left Cases' as const,
    ...UTILS.SizeVariants,
};
export const TRangeDatePickerPreview = {
    ...UTILS.SizeVariants,
    ...UTILS.States,
    Opened: 'Opened' as const,
};
export const TDatePickerPreview = {
    ...UTILS.SizeVariants,
    ...UTILS.States,
    'Form Opened': 'Form Opened' as const,
};
export const TDropdownContainerPreview = {
    ...UTILS.SizeVariants,
};
export const TAvatarStackPreview = {
    Sizes: 'Sizes',
};
export const TAccordionPreview = {
    'All Variants Expanded': 'All Variants Expanded',
    'All Variants Collapsed': 'All Variants Collapsed',
};
