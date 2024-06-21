import { TestBuilder, TComponentId, SKINS } from '../framework';
import {
    TAccordionPreview, TAlertPreview, TAvatarStackPreview, TBadgePreview, TButtonPreview,
    TCheckboxPreview, TCountIndicatorPreview, TDatePickerPreview, TDropdownContainerPreview,
    TIconButtonPreview, TLabeledInputPreview, TLinkButtonPreview, TMainMenuPreview,
    TMultiSwitchPreview, TNotificationCardPreview, TNumericInputPreview, TPaginatorPreview,
    TPickerInputPreview, TRadioGroupPreview, TRadioInputPreview, TRangeDatePickerPreview,
    TSwitchPreview, TTabButtonPreview, TTagPreview, TTextAreaPreview, TTextInputPreview,
    TTextPreview, TTooltipPreview, TVerticalTabButtonPreview,
} from '../framework/data/previewIds';

const {
    badge, button, linkButton, avatarStack, tag, checkbox, textInput, countIndicator,
    accordion, alert, iconButton, tabButton, verticalTabButton, pickerInput, datePicker,
    rangeDatePicker, textArea, text, numericInput, radioInput, radioGroup, labeledInput,
    multiSwitch, paginator, mainMenu, notificationCard, tooltip, dropdownContainer,
} = TComponentId;

const builder = new TestBuilder();

builder
    .add(alert, [
        { previewId: [TAlertPreview['Color Variants']] },
        { previewId: [TAlertPreview['Layout']] },
    ])
    .add(badge, [
        { previewId: [TBadgePreview['Color Variants']], skins: SKINS.promo_loveship_electric },
        { previewId: [TBadgePreview['Size Variants']] },
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
    .add(dropdownContainer, { previewId: values(TDropdownContainerPreview) })
    .add(iconButton, [
        {
            previewId: [TIconButtonPreview['Color Variants']],
            skins: SKINS.promo_loveship,
        },
        {
            previewId: [TIconButtonPreview['Size Variants']],
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
    .add(tooltip, { previewId: values(TTooltipPreview), skins: SKINS.promo_loveship })
    .add(tag, [
        {
            previewId: [TTagPreview['Color Variants']],
            skins: SKINS.promo_loveship_electric,
            slow: true,
        },
        {
            previewId: [TTagPreview['Size Variants']],
        },
    ])
    .add(multiSwitch, { previewId: values(TMultiSwitchPreview) })
    .add(accordion, { previewId: values(TAccordionPreview) })
    .add(avatarStack, { previewId: values(TAvatarStackPreview) })
    .add(datePicker, {
        previewId: values(TDatePickerPreview),
        focusFirstElement: ({ previewId }) => previewId === TDatePickerPreview['Form Opened'] && 'input',
    })
    .add(checkbox, { previewId: values(TCheckboxPreview) })
    .add(numericInput, { previewId: values(TNumericInputPreview) })
    .add(pickerInput, { previewId: values(TPickerInputPreview) })
    .add(rangeDatePicker, {
        previewId: values(TRangeDatePickerPreview),
        onlyChromium: true, // reason: https://github.com/microsoft/playwright/issues/20203
        focusFirstElement: ({ previewId }) => [TRangeDatePickerPreview['Opened'], TRangeDatePickerPreview['Opened With Presets']].includes(previewId as any) && 'input',
    })
    .add(tabButton, { previewId: values(TTabButtonPreview) })
    .add(TComponentId.switch, { previewId: values(TSwitchPreview) })
    .add(textArea, { previewId: values(TTextAreaPreview) })
    .add(textInput, { previewId: values(TTextInputPreview) })
    .add(verticalTabButton, { previewId: values(TVerticalTabButtonPreview) })
    .add(radioInput, { previewId: values(TRadioInputPreview) })
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
