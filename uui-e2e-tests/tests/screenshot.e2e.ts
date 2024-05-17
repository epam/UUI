import { TestBuilder, TComponentId, SKINS } from '../src';
import {
    TBadgePreview,
    TButtonPreview,
    TLinkButtonPreview,
    TAvatarStackPreview,
    TTagPreview,
    TSwitchPreview,
    TCheckboxPreview,
    TTextInputPreview,
    TCountIndicatorPreview,
    TAccordionPreview,
    TAlertPreview,
    TIconButtonPreview, TTabButtonPreview, TVerticalTabButtonPreview,
    TPickerInputPreview, TDatePickerPreview, TRangeDatePickerPreview, TTextAreaPreview, TTextPreview,
} from '../src/data/previewIds';

const {
    badge, button, linkButton, avatarStack, tag, checkbox, textInput, countIndicator,
    accordion, alert, iconButton, tabButton, verticalTabButton, pickerInput, datePicker,
    rangeDatePicker, textArea, text,
} = TComponentId;

const { values } = Object;

const builder = new TestBuilder();
// Skins tested: all
builder
    .add(tag, { previewId: values(TTagPreview), skins: SKINS.all });

// Skins tested: all except "Electric"
builder
    .add(alert, { previewId: values(TAlertPreview), skins: SKINS.allExceptElectric })
    .add(badge, { previewId: values(TBadgePreview), skins: SKINS.allExceptElectric })
    .add(button, { previewId: values(TButtonPreview), skins: SKINS.allExceptElectric })
    .add(countIndicator, { previewId: values(TCountIndicatorPreview), skins: SKINS.allExceptElectric })
    .add(iconButton, { previewId: values(TIconButtonPreview), skins: SKINS.allExceptElectric })
    .add(linkButton, { previewId: values(TLinkButtonPreview), skins: SKINS.allExceptElectric })
    .add(text, { previewId: values(TTextPreview), skins: SKINS.allExceptElectric });

// Skins not tested
builder
    .add(accordion, { previewId: values(TAccordionPreview) })
    .add(avatarStack, { previewId: values(TAvatarStackPreview) })
    .add(datePicker, {
        previewId: values(TDatePickerPreview),
        focusFirstElement: ({ previewId }) => previewId === TDatePickerPreview['Form Opened'] && 'input',
    })
    .add(checkbox, { previewId: values(TCheckboxPreview) })
    .add(pickerInput, { previewId: values(TPickerInputPreview) })
    .add(rangeDatePicker, {
        previewId: values(TRangeDatePickerPreview),
        onlyChromium: true, // reason: https://github.com/microsoft/playwright/issues/20203
        focusFirstElement: ({ previewId }) => [TRangeDatePickerPreview['Opened'], TRangeDatePickerPreview['Opened With Presets']].includes(previewId) && 'input',
    })
    .add(tabButton, { previewId: values(TTabButtonPreview) })
    .add(TComponentId.switch, { previewId: values(TSwitchPreview) })
    .add(textArea, { previewId: values(TTextAreaPreview) })
    .add(textInput, { previewId: values(TTextInputPreview) })
    .add(verticalTabButton, { previewId: values(TVerticalTabButtonPreview) });

builder.buildTests();
