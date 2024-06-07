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

const { values } = Object;

const builder = new TestBuilder();
// Skins tested: all
builder
    .add(tag, { previewId: values(TTagPreview), skins: SKINS.promo_loveship_electric, slow: true });

// Skins tested: all except "Electric"
builder
    .add(alert, { previewId: values(TAlertPreview), skins: SKINS.promo_loveship })
    .add(badge, { previewId: values(TBadgePreview), skins: SKINS.promo_loveship })
    .add(button, { previewId: values(TButtonPreview), skins: SKINS.promo_loveship })
    .add(countIndicator, { previewId: values(TCountIndicatorPreview), skins: SKINS.promo_loveship })
    .add(dropdownContainer, { previewId: values(TDropdownContainerPreview), skins: SKINS.promo_loveship })
    .add(iconButton, { previewId: values(TIconButtonPreview), skins: SKINS.promo_loveship })
    .add(linkButton, { previewId: values(TLinkButtonPreview), skins: SKINS.promo_loveship })
    .add(text, { previewId: values(TTextPreview), skins: SKINS.promo_loveship })
    .add(notificationCard, { previewId: values(TNotificationCardPreview), skins: SKINS.promo_loveship })
    .add(tooltip, { previewId: values(TTooltipPreview), skins: SKINS.promo_loveship })
    .add(multiSwitch, { previewId: values(TMultiSwitchPreview), skins: SKINS.promo_loveship });

// Skins not tested
builder
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
