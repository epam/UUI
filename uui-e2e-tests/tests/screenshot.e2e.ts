import { TestBuilder, TComponentId } from '../src';
import { TBadgePreview, TButtonPreview, TLinkButtonPreview } from '../src/data/testData';

const { badge, button, linkButton } = TComponentId;

const builder = new TestBuilder();
builder.add(badge, { previewId: Object.values(TBadgePreview) });
builder.add(button, { previewId: Object.values(TButtonPreview) });
builder.add(linkButton, { previewId: Object.values(TLinkButtonPreview) });

builder.buildTests();
