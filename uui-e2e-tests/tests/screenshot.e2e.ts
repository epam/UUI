import { TestBuilder, TComponentId } from '../src';
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
    TPickerInputPreview, TDatePickerPreview, TRangeDatePickerPreview,
} from '../src/data/previewIds';

const {
    badge, button, linkButton, avatarStack, tag, checkbox, textInput, countIndicator,
    accordion, alert, iconButton, tabButton, verticalTabButton, pickerInput, datePicker,
    rangeDatePicker,
} = TComponentId;

const { values } = Object;

const builder = new TestBuilder();
// Skin is tested
builder
    .add(alert, { previewId: values(TAlertPreview) })
    .add(badge, { previewId: values(TBadgePreview) })
    .add(button, { previewId: values(TButtonPreview) })
    .add(countIndicator, { previewId: values(TCountIndicatorPreview) })
    .add(iconButton, { previewId: values(TIconButtonPreview) })
    .add(linkButton, { previewId: values(TLinkButtonPreview) })
    .add(tag, { previewId: values(TTagPreview) });

// Skin is not tested
builder
    .add(accordion, { previewId: values(TAccordionPreview), isSkin: [false] })
    .add(avatarStack, { previewId: values(TAvatarStackPreview), isSkin: [false] })
    .add(datePicker, { previewId: values(TDatePickerPreview), isSkin: [false], focusFirstElement: ({ previewId }) => previewId === TDatePickerPreview['Form Open'] && 'input' })
    .add(checkbox, { previewId: values(TCheckboxPreview), isSkin: [false] })
    .add(pickerInput, { previewId: values(TPickerInputPreview), isSkin: [false] })
    .add(rangeDatePicker, { previewId: values(TRangeDatePickerPreview), isSkin: [false], focusFirstElement: ({ previewId }) => [TRangeDatePickerPreview['Opened'], TRangeDatePickerPreview['Opened With Presets']].includes(previewId) && 'input' })
    .add(tabButton, { previewId: values(TTabButtonPreview), isSkin: [false] })
    .add(TComponentId.switch, { previewId: values(TSwitchPreview), isSkin: [false] })
    .add(textInput, { previewId: values(TTextInputPreview), isSkin: [false] })
    .add(verticalTabButton, { previewId: values(TVerticalTabButtonPreview), isSkin: [false] });

builder.buildTests();
