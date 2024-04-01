import { TestBuilder, TComponentId } from '../src';

const { badge } = TComponentId;

const builder = new TestBuilder();
builder.add(badge, { previewId: ['Colors', 'Sizes with icon', 'Sizes without icon'] });

builder.buildTests();
