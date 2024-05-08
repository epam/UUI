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
    TPickerInputPreview, TDatePickerPreview,
} from '../src/data/previewIds';

const {
    badge, button, linkButton, avatarStack, tag, checkbox, textInput, countIndicator,
    accordion, alert, iconButton, tabButton, verticalTabButton, pickerInput, datePicker,
} = TComponentId;

const builder = new TestBuilder();
// Skin is tested
builder.add(alert, { previewId: Object.values(TAlertPreview) });
builder.add(badge, { previewId: Object.values(TBadgePreview) });
builder.add(button, { previewId: Object.values(TButtonPreview) });
builder.add(countIndicator, { previewId: Object.values(TCountIndicatorPreview) });
builder.add(iconButton, { previewId: Object.values(TIconButtonPreview) });
builder.add(linkButton, { previewId: Object.values(TLinkButtonPreview) });
builder.add(tag, { previewId: Object.values(TTagPreview) });

// Skin is not tested
builder.add(accordion, { previewId: Object.values(TAccordionPreview), isSkin: [false] });
builder.add(avatarStack, { previewId: Object.values(TAvatarStackPreview), isSkin: [false] });
builder.add(datePicker, { previewId: Object.values(TDatePickerPreview), isSkin: [false] });
builder.add(checkbox, { previewId: Object.values(TCheckboxPreview), isSkin: [false] });
builder.add(pickerInput, { previewId: Object.values(TPickerInputPreview), isSkin: [false] });
builder.add(tabButton, { previewId: Object.values(TTabButtonPreview), isSkin: [false] });
builder.add(TComponentId.switch, { previewId: Object.values(TSwitchPreview), isSkin: [false] });
builder.add(textInput, { previewId: Object.values(TTextInputPreview), isSkin: [false] });
builder.add(verticalTabButton, { previewId: Object.values(TVerticalTabButtonPreview), isSkin: [false] });

builder.buildTests();
