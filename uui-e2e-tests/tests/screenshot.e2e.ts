import { TestBuilder, TComponentId } from '../src';

const { badge, accordion, alert } = TComponentId;

const builder = new TestBuilder();
builder.add(accordion, { previewId: ['Headers', 'Unfolded body'] });
builder.add(alert, { previewId: ['Colors', 'Layout'] });
builder.add(badge, { previewId: ['Colors', 'Sizes with icon', 'Sizes without icon'] });

builder.buildTests();
