import { PreviewTestBuilder, TComponentId, SKINS } from '../../framework';
import {
    TAccordionPreview, TAlertPreview, TAvatarStackPreview, TBadgePreview, TButtonPreview,
    TCheckboxPreview, TCountIndicatorPreview, TDatePickerPreview, TDropdownContainerPreview,
    TIconButtonPreview, TLabeledInputPreview, TLinkButtonPreview, TMainMenuPreview,
    TMultiSwitchPreview, TNotificationCardPreview, TNumericInputPreview, TPaginatorPreview,
    TPickerInputPreview, TRadioGroupPreview, TRadioInputPreview, TRangeDatePickerPreview,
    TSwitchPreview, TTabButtonPreview, TTagPreview, TTextAreaPreview, TTextInputPreview,
    TTextPreview, TTooltipPreview, TVerticalTabButtonPreview,
} from '@epam/uui-docs';

const {
    badge, button, linkButton, avatarStack, tag, checkbox, textInput, countIndicator,
    accordion, alert, iconButton, tabButton, verticalTabButton, pickerInput, datePicker,
    rangeDatePicker, textArea, text, numericInput, radioInput, radioGroup, labeledInput,
    multiSwitch, paginator, mainMenu, notificationCard, tooltip, dropdownContainer,
} = TComponentId;

const builder = new PreviewTestBuilder();

builder
    .add(badge, [
        { previewId: [TBadgePreview['Color Variants']], skins: SKINS.promo_loveship_electric },
        { previewId: [TBadgePreview['Size Variants']] },
        {
            onlyChromium: true,
            previewId: [TButtonPreview['Color Variants']],
            previewTag: 'PseudoStateHover',
            skins: SKINS.promo_loveship_electric,
            forcePseudoState: [{ state: 'hover', selector: '.uui-badge' }],
        },
    ])
    .add(button, [
        {
            previewId: [TButtonPreview['Size Variants']],
        },
        {
            previewId: [TButtonPreview['Color Variants']],
            skins: SKINS.promo_loveship,
        },
        {
            onlyChromium: true,
            previewId: [TButtonPreview['Color Variants']],
            previewTag: 'PseudoStateActive',
            skins: SKINS.promo_loveship,
            forcePseudoState: [{ state: 'active', selector: '.uui-button' }],
        },
        {
            onlyChromium: true,
            previewId: [TButtonPreview['Color Variants']],
            previewTag: 'PseudoStateHover',
            skins: SKINS.promo_loveship,
            forcePseudoState: [{ state: 'hover', selector: '.uui-button' }],
        },
    ])
    .add(countIndicator, [
        {
            previewId: [TCountIndicatorPreview['Color Variants']],
            skins: SKINS.promo_loveship,
        },
        {
            previewId: [TCountIndicatorPreview['Size Variants']],
        },
    ])
    .add(iconButton, [
        {
            previewId: [TIconButtonPreview['Color Variants']],
            skins: SKINS.promo_loveship,
        },
        {
            previewId: [TIconButtonPreview['Size Variants']],
        },
        {
            onlyChromium: true,
            previewId: [TIconButtonPreview['Color Variants']],
            previewTag: 'PseudoStateActive',
            skins: SKINS.promo_loveship,
            forcePseudoState: [{ state: 'active', selector: '.uui-icon_button' }],
        },
        {
            onlyChromium: true,
            previewId: [TIconButtonPreview['Color Variants']],
            previewTag: 'PseudoStateHover',
            skins: SKINS.promo_loveship,
            forcePseudoState: [{ state: 'hover', selector: '.uui-icon_button' }],
        },
    ])
    .add(linkButton, [
        {
            previewId: [TLinkButtonPreview['Color Variants']],
            skins: SKINS.promo_loveship,
        },
        {
            previewId: [TLinkButtonPreview['Size Variants']],
        },
        {
            onlyChromium: true,
            previewId: [TLinkButtonPreview['Color Variants']],
            previewTag: 'PseudoStateActive',
            skins: SKINS.promo_loveship,
            forcePseudoState: [{ state: 'active', selector: '.uui-link_button' }],
        },
        {
            onlyChromium: true,
            previewId: [TLinkButtonPreview['Color Variants']],
            previewTag: 'PseudoStateHover',
            skins: SKINS.promo_loveship,
            forcePseudoState: [{ state: 'hover', selector: '.uui-link_button' }],
        },
    ])
    .add(text, [
        {
            previewId: [TTextPreview['Color Variants']],
            skins: SKINS.promo_loveship,
        },
        {
            previewId: [TTextPreview['Size Variants']],
        },
    ])
    .add(notificationCard, [
        {
            previewId: [TNotificationCardPreview['Color Variants']],
            skins: SKINS.promo_loveship,
        },
        {
            previewId: [TNotificationCardPreview['Size Variants']],
        },
    ])
    .add(tag, [
        {
            previewId: [TTagPreview['Color Variants']],
            skins: SKINS.promo_loveship_electric,
            slow: true,
        },
        {
            previewId: [TTagPreview['Size Variants']],
        },
        {
            onlyChromium: true,
            previewId: [TLinkButtonPreview['Color Variants']],
            previewTag: 'PseudoStateHover',
            skins: SKINS.promo_loveship_electric,
            forcePseudoState: [{ state: 'hover', selector: '.uui-tag' }],
        },
    ])
    .add(checkbox, [
        {
            previewId: [TCheckboxPreview['States']],
        },
        {
            previewId: [TCheckboxPreview['Size Variants']],
        },
        {
            onlyChromium: true,
            previewId: [TCheckboxPreview['States']],
            previewTag: 'PseudoStateHover',
            forcePseudoState: [{ state: 'hover', selector: '.uui-checkbox-container' }],
        },
    ])
    .add(numericInput, [
        {
            previewId: [TNumericInputPreview['States']],
        },
        {
            previewId: [TNumericInputPreview['Size Variants']],
        },
        {
            onlyChromium: true,
            previewId: [TNumericInputPreview['States']],
            previewTag: 'PseudoStateHover',
            forcePseudoState: [{ state: 'hover', selector: '.uui-input-box' }],
        },
    ])
    .add(pickerInput, [
        ...values(TPickerInputPreview, { exclude: [TPickerInputPreview['Opened multi']] }).map((i) => ({ previewId: [i] })),
        {
            onlyChromium: true,
            previewId: [TPickerInputPreview['Modes + States']],
            previewTag: 'PseudoStateHover',
            forcePseudoState: [{ state: 'hover', selector: '.uui-input-box' }],
        },
        {
            onlyChromium: true,
            previewId: [TPickerInputPreview['Opened multi']],
        },
    ])
    .add(rangeDatePicker, [
        {
            previewId: [TRangeDatePickerPreview['States']],
            onlyChromium: true,
        },
        {
            previewId: [TRangeDatePickerPreview['Size Variants']],
            onlyChromium: true,
        },
        {
            previewId: [TRangeDatePickerPreview['Opened']],
            clickElement: () => 'input',
            onlyChromium: true,
        },
        {
            onlyChromium: true,
            previewId: [TRangeDatePickerPreview['States']],
            previewTag: 'PseudoStateHover',
            forcePseudoState: [{ state: 'hover', selector: '.uui-range-date-picker' }],
        },
    ])
    .add(datePicker, [
        {
            previewId: [TDatePickerPreview['States']],
            onlyChromium: true,
        },
        {
            previewId: [TDatePickerPreview['Size Variants']],
            onlyChromium: true,
        },
        {
            previewId: [TDatePickerPreview['Opened']],
            clickElement: () => 'input',
            onlyChromium: true,
        },
        {
            onlyChromium: true,
            previewId: [TDatePickerPreview['States']],
            previewTag: 'PseudoStateHover',
            forcePseudoState: [{ state: 'hover', selector: '.uui-input-box' }],
        },
    ])
    .add(tabButton, [
        {
            previewId: [TTabButtonPreview['States']],
        },
        {
            previewId: [TTabButtonPreview['Size Variants']],
        },
        {
            onlyChromium: true,
            previewId: [TTabButtonPreview['States']],
            previewTag: 'PseudoStateHover',
            forcePseudoState: [{ state: 'hover', selector: '.uui-tab-button' }],
        },
    ])
    .add(TComponentId.switch, [
        {
            previewId: [TSwitchPreview['States']],
        },
        {
            previewId: [TSwitchPreview['Size Variants']],
        },
        {
            onlyChromium: true,
            previewId: [TSwitchPreview['States']],
            previewTag: 'PseudoStateHover',
            forcePseudoState: [{ state: 'hover', selector: '.uui-switch' }],
        },
    ])
    .add(textArea, [
        {
            previewId: [TTextAreaPreview['States']],
        },
        {
            previewId: [TTextAreaPreview['Size Variants']],
        },
        {
            onlyChromium: true,
            previewId: [TTextAreaPreview['States']],
            previewTag: 'PseudoStateHover',
            forcePseudoState: [{ state: 'hover', selector: '.uui-input' }],
        },
    ])
    .add(textInput, [
        {
            previewId: [TTextInputPreview['States']],
        },
        {
            previewId: [TTextInputPreview['Size Variants']],
        },
        {
            onlyChromium: true,
            previewId: [TTextInputPreview['States']],
            previewTag: 'PseudoStateHover',
            forcePseudoState: [{ state: 'hover', selector: '.uui-input-box' }],
        },
    ])
    .add(verticalTabButton, [
        {
            previewId: [TVerticalTabButtonPreview['States']],
        },
        {
            previewId: [TVerticalTabButtonPreview['Size Variants']],
        },
        {
            onlyChromium: true,
            previewId: [TVerticalTabButtonPreview['States']],
            previewTag: 'PseudoStateHover',
            forcePseudoState: [{ state: 'hover', selector: '.uui-tab-button' }],
        },
    ])
    .add(radioInput, [
        {
            previewId: [TRadioInputPreview.States],
        },
        {
            previewId: [TRadioInputPreview['Size Variants']],
        },
        {
            onlyChromium: true,
            previewId: [TRadioInputPreview['States']],
            previewTag: 'PseudoStateHover',
            forcePseudoState: [{ state: 'hover', selector: '.uui-radio-input-container' }],
        },
    ])
    .add(alert, { previewId: values(TAlertPreview) })
    .add(tooltip, { previewId: values(TTooltipPreview), skins: SKINS.promo_loveship })
    .add(multiSwitch, { previewId: values(TMultiSwitchPreview) })
    .add(accordion, { previewId: values(TAccordionPreview) })
    .add(avatarStack, { previewId: values(TAvatarStackPreview) })
    .add(dropdownContainer, { previewId: values(TDropdownContainerPreview) })
    .add(radioGroup, { previewId: values(TRadioGroupPreview) })
    .add(labeledInput, { previewId: values(TLabeledInputPreview) })
    .add(mainMenu, { previewId: values(TMainMenuPreview) })
    .add(paginator, { previewId: values(TPaginatorPreview) });

builder.buildTests();

function values<Obj extends object, ObjValue extends Obj[keyof Obj]>(o: Obj, opts?: { exclude: ObjValue[] }): ObjValue[] {
    const arr = Object.values(o);
    if (opts?.exclude) {
        return arr.filter((v) => opts.exclude.indexOf(v) === -1);
    }
    return arr;
}
