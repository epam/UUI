/**
 *
 * Preview IDs are used for screenshot tests
 *
 * These files MUST be kept in sync:
 * app/src/docs/_types/previewIds.ts --> uui-e2e-tests/src/data/previewIds.ts
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
    'Form Invalid'= 'Form Invalid',
    'Form Disabled'= 'Form Disabled',
    'Form ReadOnly'= 'Form ReadOnly',
    'Inline'= 'Inline',
    'Inline Disabled'= 'Inline Disabled',
    'Inline ReadOnly'= 'Inline ReadOnly'
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
export enum TTabButtonPreview {
    'Active' = 'Active',
    'Active Disabled' = 'Active Disabled',
    'Active Dropdown' = 'Active Dropdown',
    'Active Dropdown Disabled' = 'Active Dropdown Disabled',
    'Inactive' = 'Inactive',
    'Inactive Disabled' = 'Inactive Disabled',
    'Inactive Dropdown' = 'Inactive Dropdown',
    'Inactive Dropdown Disabled' = 'Inactive Dropdown Disabled'
}
export enum TVerticalTabButtonPreview {
    'Active' = 'Active',
    'Active Disabled' = 'Active Disabled',
    'Active Dropdown' = 'Active Dropdown',
    'Active Dropdown Disabled' = 'Active Dropdown Disabled',
    'Inactive' = 'Inactive',
    'Inactive Disabled' = 'Inactive Disabled',
    'Inactive Dropdown' = 'Inactive Dropdown',
    'Inactive Dropdown Disabled' = 'Inactive Dropdown Disabled'
}

export enum TPickerInputPreview {
    /* FORM */
    'Form Single'= 'Form Single',
    'Form Single Invalid'= 'Form Single Invalid',
    'Form Single Disabled'= 'Form Single Disabled',
    'Form Single ReadOnly'= 'Form Single ReadOnly',
    'Form Single HasValue'= 'Form Single HasValue',
    'Form Single HasValue Invalid'= 'Form Single HasValue Invalid',
    'Form Single HasValue Disabled'= 'Form Single HasValue Disabled',
    'Form Single HasValue ReadOnly'= 'Form Single HasValue ReadOnly',
    'Form Multi'= 'Form Multi',
    'Form Multi Invalid'= 'Form Multi Invalid',
    'Form Multi Disabled'= 'Form Multi Disabled',
    'Form Multi ReadOnly'= 'Form Multi ReadOnly',
    'Form Multi HasValue'= 'Form Multi HasValue',
    'Form Multi HasValue Invalid'= 'Form Multi HasValue Invalid',
    'Form Multi HasValue Disabled'= 'Form Multi HasValue Disabled',
    'Form Multi HasValue ReadOnly'= 'Form Multi HasValue ReadOnly',
    'Form Multi HasValue Multiline'= 'Form Multi HasValue Multiline',
    'Form Multi HasValue Multiline Invalid'= 'Form Multi HasValue Multiline Invalid',
    'Form Multi HasValue Multiline Disabled'= 'Form Multi HasValue Multiline Disabled',
    'Form Multi HasValue Multiline ReadOnly'= 'Form Multi HasValue Multiline ReadOnly',
    'Form Multi HasValue Overflow'= 'Form Multi HasValue Overflow',
    'Form Multi HasValue Overflow Invalid'= 'Form Multi HasValue Overflow Invalid',
    'Form Multi HasValue Overflow Disabled'= 'Form Multi HasValue Overflow Disabled',
    'Form Multi HasValue Overflow ReadOnly'= 'Form Multi HasValue Overflow ReadOnly',
    'Form Opened Dropdown List' = 'Form Opened Dropdown List',
    'Form Opened Dropdown Multi List' = 'Form Opened Dropdown Multi List',
    'Form Opened Dropdown Tree' = 'Form Opened Dropdown Tree',
    'Form Opened Dropdown Multi Tree' = 'Form Opened Dropdown Multi Tree',
    /* INLINE */
    'Inline Single'= 'Inline Single',
    'Inline Single Disabled'= 'Inline Single Disabled',
    'Inline Single ReadOnly'= 'Inline Single ReadOnly',
    'Inline Single HasValue'= 'Inline Single HasValue',
    'Inline Single HasValue Disabled'= 'Inline Single HasValue Disabled',
    'Inline Single HasValue ReadOnly'= 'Inline Single HasValue ReadOnly',
    'Inline Multi'= 'Inline Multi',
    'Inline Multi Disabled'= 'Inline Multi Disabled',
    'Inline Multi ReadOnly'= 'Inline Multi ReadOnly',
    'Inline Multi HasValue'= 'Inline Multi HasValue',
    'Inline Multi HasValue Disabled'= 'Inline Multi HasValue Disabled',
    'Inline Multi HasValue ReadOnly'= 'Inline Multi HasValue ReadOnly',
    'Inline Multi HasValue MultiLine'= 'Inline Multi HasValue MultiLine',
    'Inline Multi HasValue MultiLine Disabled'= 'Inline Multi HasValue MultiLine Disabled ',
    'Inline Multi HasValue MultiLine ReadOnly'= 'Inline Multi HasValue MultiLine ReadOnly',
    'Inline Multi HasValue Overflow'= 'Inline Multi HasValue Overflow',
    'Inline Multi HasValue Overflow Disabled'= 'Inline Multi HasValue Overflow Disabled',
    'Inline Multi HasValue Overflow ReadOnly'= 'Inline Multi HasValue Overflow ReadOnly',
    /* CELL */
    'Cell Single'= 'Cell Single',
    'Cell Single Disabled'= 'Cell Single Disabled',
    'Cell Single ReadOnly'= 'Cell Single ReadOnly',
    'Cell Single HasValue'= 'Cell Single HasValue',
    'Cell Single HasValue Disabled'= 'Cell Single HasValue Disabled',
    'Cell Single HasValue ReadOnly'= 'Cell Single HasValue ReadOnly',
    'Cell Multi'= 'Cell Multi',
    'Cell Multi Disabled'= 'Cell Multi Disabled',
    'Cell Multi ReadOnly'= 'Cell Multi ReadOnly',
    'Cell Multi HasValue'= 'Cell Multi HasValue',
    'Cell Multi HasValue Disabled'= 'Cell Multi HasValue Disabled',
    'Cell Multi HasValue ReadOnly'= 'Cell Multi HasValue ReadOnly',
    'Cell Multi HasValue MultiLine'= 'Cell Multi HasValue MultiLine',
    'Cell Multi HasValue MultiLine Disabled'= 'Cell Multi HasValue MultiLine Disabled ',
    'Cell Multi HasValue MultiLine ReadOnly'= 'Cell Multi HasValue MultiLine ReadOnly',
    'Cell Multi HasValue Overflow'= 'Cell Multi HasValue Overflow',
    'Cell Multi HasValue Overflow Disabled'= 'Cell Multi HasValue Overflow Disabled',
    'Cell Multi HasValue Overflow ReadOnly'= 'Cell Multi HasValue Overflow ReadOnly'
}

export enum TDatePickerPreview {
    Form = 'Form',
    'Form Open' = 'Form Open',
    'Form Disabled' = 'Form Disabled',
    'Form ReadOnly' = 'Form ReadOnly',
    Cell = 'Cell',
    'Cell Disabled' = 'Cell Disabled',
    'Cell ReadOnly' = 'Cell ReadOnly',
    Inline = 'Inline',
    'Inline Disabled' = 'Inline Disabled',
    'Inline ReadOnly' = 'Inline ReadOnly'
}

export enum TRangeDatePickerPreview {
    'Basic' = 'Basic',
    'Opened' = 'Opened',
    'Opened With Presets' = 'Opened With Presets',
    'ReadOnly' = 'ReadOnly',
    'Disabled' = 'Disabled'
}
