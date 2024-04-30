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
} from '../src/data/testData';

const { badge, button, linkButton, avatarStack, tag, checkbox, textInput, countIndicator } = TComponentId;

const builder = new TestBuilder();
builder.add(badge, { previewId: Object.values(TBadgePreview) });
builder.add(button, { previewId: Object.values(TButtonPreview) });
builder.add(linkButton, { previewId: Object.values(TLinkButtonPreview) });
builder.add(avatarStack, { previewId: Object.values(TAvatarStackPreview) });
builder.add(tag, { previewId: Object.values(TTagPreview) });
builder.add(TComponentId.switch, { previewId: Object.values(TSwitchPreview) });
builder.add(checkbox, { previewId: Object.values(TCheckboxPreview) });
builder.add(textInput, { previewId: Object.values(TTextInputPreview) });
builder.add(countIndicator, { previewId: Object.values(TCountIndicatorPreview) });

builder.buildTests();
